'use client'
import React, { useEffect, useState, useRef } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoCaretDownSharp } from 'react-icons/io5';
import { MdChevronRight } from 'react-icons/md';
import { TbCategoryPlus } from 'react-icons/tb';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { categoryDataSelector, categoryLimit, categoryPage, IsLoadMoreCates, setCategoryData, updateTotalCates } from '@/redux/reducers/categorySlice';
import { setCateOffset } from '@/utils/helpers';
import Link from 'next/link';
import { getCategories, CategoryItem } from '@/utils/api/user/getCategories';
import { extractErrorMessage } from '@/utils/helpers';
import { useTranslation } from '@/hooks/useTranslation';
import { currentLanguageSelector } from '@/redux/reducers/languageSlice';

const CategoriesDropdown: React.FC = () => {
    
    const { t } = useTranslation();
    const currentLanguageCode = useSelector(currentLanguageSelector);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState<boolean>(false);

    const dispatch = useDispatch();
    const categoriesData = useSelector(categoryDataSelector) as CategoryItem[]
    const [subCategoriesData, setSubCategoriesData] = useState<CategoryItem[]>([]);
    const [nestedCategoriesData, setNestedCategoriesData] = useState<CategoryItem[]>([]);

    const [showSubCategory, setShowSubCategory] = useState<boolean>(false);
    const [showNestedCategory, setShowNestedCategory] = useState<boolean>(false);

    // Loading states
    const [loadingSubCategory, setLoadingSubCategory] = useState<number | null>(null);
    const [loadingNestedCategory, setLoadingNestedCategory] = useState<number | null>(null);

    // Refs to track mouse position and dropdown elements
    const dropdownRef = useRef<HTMLDivElement>(null);
    const subDropdownRef = useRef<HTMLDivElement>(null);
    const nestedDropdownRef = useRef<HTMLDivElement>(null);
    const mouseLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const cateLimit = useSelector(categoryLimit)
    const page = useSelector(categoryPage)
    const isLoadMoreCategories = useSelector(IsLoadMoreCates)

    // category 
    const firstLoadCate = typeof window !== 'undefined' ? sessionStorage.getItem('firstLoad_Cate') : null
    const manualRefreshCate = typeof window !== 'undefined' ? sessionStorage.getItem('manualRefresh_Cate') : null
    const shouldFetchCategories = !firstLoadCate || manualRefreshCate === 'true'

    if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('manualRefresh_Cate', 'true')
        })

        window.addEventListener('load', () => {
            if (!sessionStorage.getItem('lastFetch_Cate')) {
                sessionStorage.setItem('manualRefresh_Cate', 'true')
            }
        })
    }

    const fetchCategoriesData = async (id?: number, isNestedClick?: boolean) => {
        try {
            // Set loading state based on the type of request
            if (id && !isNestedClick) {
                setLoadingSubCategory(id);
            } else if (id && isNestedClick) {
                setLoadingNestedCategory(id);
            }

            const response = await getCategories({
                id: id,
                get_subcategory: id ? 1 : 0,
                per_page: cateLimit,
                page: id ? null : shouldFetchCategories ? 1 : page,
            });

            if (response) {
                // Check if API returned an error (error: true in response)
                if (!response.error) {
                    if (response.data?.data) {
                        const extractedCategories = response.data.data;
                        if (!id) {
                            dispatch(updateTotalCates({ data: response.data.total }))
                        }

                        if (extractedCategories) {
                            if (!id && !isLoadMoreCategories) {
                                dispatch(setCategoryData(extractedCategories))
                                if (typeof window !== 'undefined') {
                                    sessionStorage.setItem('lastFetch_Cate', Date.now().toString())
                                }
                            }
                            else if (!id && isLoadMoreCategories) {
                                dispatch(setCategoryData([...categoriesData, ...extractedCategories]))
                            }
                            else if (id && !isNestedClick) {
                                // Clear nested categories when switching to a different parent category
                                setNestedCategoriesData([])
                                setShowNestedCategory(false)
                                setSubCategoriesData(extractedCategories)
                                setShowSubCategory(true)
                            }
                            else if (isNestedClick) {
                                setNestedCategoriesData(extractedCategories)
                                setShowNestedCategory(true)
                            }
                        }
                    } else {
                        console.log('No categories data found in response');
                        dispatch(setCategoryData([]));
                    }
                } else {
                    console.log("API error:", response.message);
                    toast.error(response.message || "Failed to fetch categories");
                    dispatch(setCategoryData([]));
                }
            } else {
                console.log("response is null in component", response);
                dispatch(setCategoryData([]));
            }
        } catch (error) {
            dispatch(setCategoryData([]))
            extractErrorMessage(error);
        } finally {
            // Clear loading states
            if (id && !isNestedClick) {
                setLoadingSubCategory(null);
            } else if (id && isNestedClick) {
                setLoadingNestedCategory(null);
            }
        }
    }

    useEffect(() => {
        if (shouldFetchCategories) {
            setCateOffset(0);
        }

        if (shouldFetchCategories || isLoadMoreCategories) {
            fetchCategoriesData();
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('manualRefresh_Cate')
                sessionStorage.setItem('firstLoad_Cate', 'true')
            }
        }
    }, [page])

    // Helper function to check if mouse is over any dropdown
    const isMouseOverAnyDropdown = (event: MouseEvent): boolean => {
        const elements = [dropdownRef.current, subDropdownRef.current, nestedDropdownRef.current];

        return elements.some(element => {
            if (!element) return false;
            const rect = element.getBoundingClientRect();
            return (
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom
            );
        });
    };

    // Improved mouse leave handler with proper boundary detection
    const handleMouseLeave = (event: React.MouseEvent) => {
        // Clear any existing timeout
        if (mouseLeaveTimeoutRef.current) {
            clearTimeout(mouseLeaveTimeoutRef.current);
        }

        // Add a small delay to prevent flickering when moving between dropdowns
        mouseLeaveTimeoutRef.current = setTimeout(() => {
            const mouseEvent = event.nativeEvent;

            // Check if mouse is still over any dropdown
            if (!isMouseOverAnyDropdown(mouseEvent)) {
                setShowCategoryDropdown(false);
                setShowSubCategory(false);
                setShowNestedCategory(false);
            }
        }, 100); // Small delay to allow smooth transition
    };

    // Mouse enter handler to cancel close timeout
    const handleMouseEnter = () => {
        if (mouseLeaveTimeoutRef.current) {
            clearTimeout(mouseLeaveTimeoutRef.current);
        }
    };

    // Handle sub-category mouse leave
    const handleSubCategoryLeave = (event: React.MouseEvent) => {
        if (mouseLeaveTimeoutRef.current) {
            clearTimeout(mouseLeaveTimeoutRef.current);
        }

        mouseLeaveTimeoutRef.current = setTimeout(() => {
            const mouseEvent = event.nativeEvent;
            const mainDropdown = dropdownRef.current?.getBoundingClientRect();
            const subDropdown = subDropdownRef.current?.getBoundingClientRect();
            const nestedDropdown = nestedDropdownRef.current?.getBoundingClientRect();

            let isOverValidArea = false;

            // Check if mouse is over main dropdown
            if (mainDropdown) {
                isOverValidArea = isOverValidArea || (
                    mouseEvent.clientX >= mainDropdown.left &&
                    mouseEvent.clientX <= mainDropdown.right &&
                    mouseEvent.clientY >= mainDropdown.top &&
                    mouseEvent.clientY <= mainDropdown.bottom
                );
            }

            // Check if mouse is over sub dropdown
            if (subDropdown) {
                isOverValidArea = isOverValidArea || (
                    mouseEvent.clientX >= subDropdown.left &&
                    mouseEvent.clientX <= subDropdown.right &&
                    mouseEvent.clientY >= subDropdown.top &&
                    mouseEvent.clientY <= subDropdown.bottom
                );
            }

            // Check if mouse is over nested dropdown
            if (nestedDropdown && showNestedCategory) {
                isOverValidArea = isOverValidArea || (
                    mouseEvent.clientX >= nestedDropdown.left &&
                    mouseEvent.clientX <= nestedDropdown.right &&
                    mouseEvent.clientY >= nestedDropdown.top &&
                    mouseEvent.clientY <= nestedDropdown.bottom
                );
            }

            if (!isOverValidArea) {
                setShowSubCategory(false);
                setShowNestedCategory(false);
                if (!mainDropdown || !(
                    mouseEvent.clientX >= mainDropdown.left &&
                    mouseEvent.clientX <= mainDropdown.right &&
                    mouseEvent.clientY >= mainDropdown.top &&
                    mouseEvent.clientY <= mainDropdown.bottom
                )) {
                    setShowCategoryDropdown(false);
                }
            }
        }, 100);
    };

    // Handle nested category mouse leave
    const handleNestedCategoryLeave = (event: React.MouseEvent) => {
        if (mouseLeaveTimeoutRef.current) {
            clearTimeout(mouseLeaveTimeoutRef.current);
        }

        mouseLeaveTimeoutRef.current = setTimeout(() => {
            const mouseEvent = event.nativeEvent;

            if (!isMouseOverAnyDropdown(mouseEvent)) {
                setShowNestedCategory(false);
                // Check if we should also close sub and main dropdowns
                const mainDropdown = dropdownRef.current?.getBoundingClientRect();
                const subDropdown = subDropdownRef.current?.getBoundingClientRect();

                let shouldCloseAll = true;

                if (mainDropdown && (
                    mouseEvent.clientX >= mainDropdown.left &&
                    mouseEvent.clientX <= mainDropdown.right &&
                    mouseEvent.clientY >= mainDropdown.top &&
                    mouseEvent.clientY <= mainDropdown.bottom
                )) {
                    shouldCloseAll = false;
                }

                if (subDropdown && (
                    mouseEvent.clientX >= subDropdown.left &&
                    mouseEvent.clientX <= subDropdown.right &&
                    mouseEvent.clientY >= subDropdown.top &&
                    mouseEvent.clientY <= subDropdown.bottom
                )) {
                    shouldCloseAll = false;
                }

                if (shouldCloseAll) {
                    setShowSubCategory(false);
                    setShowCategoryDropdown(false);
                }
            }
        }, 100);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (mouseLeaveTimeoutRef.current) {
                clearTimeout(mouseLeaveTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="sm:col-span-12 lg:col-span-5 xl:col-span-3 2xl:col-span-2 between-1200-1399:col-span-3 col-span-2 primaryLightBg py-3 p-3 rounded-[4px] hidden lg:flexCenter gap-3 primaryColor cursor-pointer relative w-full"
            onClick={() => {
                setShowCategoryDropdown(true);
            }}
        >
            <DropdownMenu
                open={showCategoryDropdown}
                onOpenChange={setShowCategoryDropdown}
            >
                <DropdownMenuTrigger asChild>
                    <div className='flexCenter gap-2'>
                        <span className="">
                            <TbCategoryPlus size={24} />
                        </span>
                        <div
                            className="flexCenter gap-1"
                            onClick={() => {
                                setShowCategoryDropdown(true);
                            }}
                        >
                            <span className="font-semibold">{t('explore_cat')}</span>
                            <span>
                                <IoCaretDownSharp />
                            </span>
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-[250px] max-w-full border-none shadow-lg"
                    align="center"
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={handleMouseEnter}
                >
                    {/* Categories */}
                    {showCategoryDropdown && (
                        <div
                            ref={dropdownRef}
                            className="bg-white text-black w-full h-max flex flex-col gap-2 z-[1]"
                            onMouseEnter={handleMouseEnter}
                        >
                            <div className="bg-white text-black w-full h-max flex flex-col gap-">
                                {
                                    categoriesData.map((category) => (
                                        category.has_subcategory ? (
                                            <div
                                                className="flexCenter justify-between p-2 bodyBg cursor-pointer hover:sectionBg hover:primaryColor transition-all duration-300"
                                                key={category.id}
                                                onClick={() => fetchCategoriesData(category.id)}
                                            >
                                                <span className='break-all'>{category.name}</span>
                                                {loadingSubCategory === category.id ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                                ) : (
                                                    <span>
                                                        <MdChevronRight />
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <Link
                                                href={`/courses/${category.slug}?lang=${currentLanguageCode}`}
                                                title={category.name}
                                                className="flexCenter justify-between p-2 bodyBg cursor-pointer hover:sectionBg hover:primaryColor transition-all duration-300"
                                                key={category.id}
                                            >
                                                <span className='break-all'>{category.name}</span>
                                            </Link>
                                        )
                                    ))
                                }
                            </div>
                        </div>
                    )}

                    {/* Sub-categories */}
                    {categoriesData && subCategoriesData[0] && subCategoriesData[0].subcategories && subCategoriesData[0].subcategories.length > 0 && showSubCategory && (
                        <div
                            ref={subDropdownRef}
                            className="bg-white text-black absolute w-full h-max -right-[100%] top-0 p- flex flex-col z-[2]"
                            onMouseLeave={handleSubCategoryLeave}
                            onMouseEnter={handleMouseEnter}
                        >
                            <Link
                                href={`/courses/${subCategoriesData[0].slug}?lang=${currentLanguageCode}`}
                                title={subCategoriesData[0].name}
                                className="flexCenter justify-between p-2 sectionBg hover:sectionBg hover:primaryColor transition-all duration-300"
                            >
                                <span className='break-all'>{subCategoriesData[0].name}</span>
                            </Link>
                            {
                                subCategoriesData[0].subcategories.map((subcategory) => (
                                    subcategory.has_subcategory ? (
                                        <div
                                            className="flexCenter justify-between p-2 bodyBg cursor-pointer hover:sectionBg hover:primaryColor transition-all duration-300"
                                            key={subcategory.id}
                                            onClick={() => fetchCategoriesData(subcategory.id, true)}
                                        >
                                            <span className='break-all'>{subcategory.name}</span>
                                            {loadingNestedCategory === subcategory.id ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                            ) : (
                                                <span>
                                                    <MdChevronRight />
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href={`/courses/${subCategoriesData[0].slug}/${subcategory.slug}?lang=${currentLanguageCode}`}
                                            title={subcategory.name}
                                            className="flexCenter justify-between p-2 bodyBg hover:sectionBg hover:primaryColor transition-all duration-300"
                                            key={subcategory.id}
                                        >
                                            <span className='break-all'>{subcategory.name}</span>
                                        </Link>
                                    )
                                ))
                            }
                        </div>
                    )}

                    {/* Nested categories */}
                    {showNestedCategory && nestedCategoriesData && nestedCategoriesData[0] && nestedCategoriesData[0].subcategories && nestedCategoriesData[0].subcategories.length > 0 && (
                        <div
                            ref={nestedDropdownRef}
                            className="bg-white text-black absolute w-full h-max -right-[199%] top-0 p- flex flex-col gap- z-[3]"
                            onMouseLeave={handleNestedCategoryLeave}
                            onMouseEnter={handleMouseEnter}
                        >
                            <Link
                                href={`/courses/${nestedCategoriesData[0].slug}?lang=${currentLanguageCode}`}
                                title={nestedCategoriesData[0].name}
                                className="flexCenter justify-between p-2 sectionBg hover:sectionBg hover:primaryColor transition-all duration-300"
                            >
                                <span className='break-all'>{nestedCategoriesData[0].name}</span>
                            </Link>
                            {
                                nestedCategoriesData[0].subcategories.map((subcategory) => (
                                    <Link
                                        href={`/courses/${subCategoriesData[0].slug}/${nestedCategoriesData[0].slug}/${subcategory.slug}?lang=${currentLanguageCode}`}
                                        title={subcategory.name}
                                        className="flexCenter justify-between p-2 bodyBg cursor-pointer hover:sectionBg hover:primaryColor transition-all duration-300"
                                        key={subcategory.id}
                                    >
                                        <span className='break-all'>{subcategory.name}</span>
                                    </Link>
                                ))
                            }
                        </div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default CategoriesDropdown