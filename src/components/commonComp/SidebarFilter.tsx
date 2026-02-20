
import {
  categoryDataSelector,
} from "@/redux/reducers/categorySlice";
import {
  CategoryDataType,
  SidebarFilterTypes,
} from "@/types";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useMemo, useCallback, memo } from "react";

import { FaChevronDown, FaChevronUp, FaStar } from "react-icons/fa";

import { useSelector } from "react-redux";
import CategoryNode from "./CtegoryNode";
import { courseLanguageDataSelector } from "@/redux/reducers/courseLanguageSlice";
import { CourseLanguage } from "@/utils/api/general/getCourseLanguages";
import { useTranslation } from "@/hooks/useTranslation";


interface Category {
  name: string;
  icon?: React.ReactNode;
  subcategories?: Category[];
  count?: number;
}

type FilterSection = {
  title: string;
  items: (Category | { name: string; filterValue: string | number })[];
  type?: "checkbox" | "radio";
  filterKey?: string;
};

interface SidebarFilterProps {
  sidebarFilter: SidebarFilterTypes;
  setSidebarFilter: (filter: SidebarFilterTypes) => void;
  mobileComp?: boolean;
  isInstructorPage?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCategorySelect?: (category: any) => void;
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  sidebarFilter,
  setSidebarFilter,
  mobileComp,
  // onCategorySelect,
}) => {
  const pathname = usePathname();
  // const searchParams = useSearchParams();
  const isCoursesPage = pathname.includes("/courses");
  const isInstructorPage = pathname.includes("/instructors");
  const { t } = useTranslation();
  const courseLanguages = useSelector(courseLanguageDataSelector);

  const filterSections: FilterSection[] = useMemo(() => {
    return [
      {
        title: "Categories",
        type: "checkbox",
        items: [],
      },
      ...(!isInstructorPage
        ? [
          {
            title: t("course_level"),
            filterKey: "level",
            type: "checkbox" as const,
            items: [
              { name: t("beginner"), filterValue: "beginner" },
              { name: t("intermediate"), filterValue: "intermediate" },
              { name: t("advanced"), filterValue: "advanced" },
            ],
          },
          {
            title: t("language"),
            filterKey: "language",
            type: "checkbox" as const,
            items: [
              ...courseLanguages.map((language: CourseLanguage) => ({
                name: language.name,
                filterValue: language.id
              })),
            ],
          },
          {
            title: t("course_duration"),
            filterKey: "duration",
            type: "checkbox" as const,
            items: [
              { name: t("weeks_1_4"), filterValue: "1-4_weeks" },
              { name: t("weeks_4_12"), filterValue: "4-12_weeks" },
              { name: t("months_3_6"), filterValue: "3-6_months" },
              { name: t("months_6_12"), filterValue: "6-12_months" },
            ],
          },
          {
            title: t("price"),
            type: "checkbox" as const,
            filterKey: "price",
            items: [
              { name: t("free"), filterValue: "free" },
              { name: t("paid"), filterValue: "paid" },
            ],
          },
        ]
        : []),
      {
        title: t("rating"),
        type: "checkbox" as const,
        filterKey: "rating",
        items: [
          { name: "5", filterValue: 5 },
          { name: "4", filterValue: 4 },
          { name: "3", filterValue: 3 },
          { name: "2", filterValue: 2 },
          { name: "1", filterValue: 1 },
        ],
      },
    ];
  }, [isInstructorPage]);

  // State to track expanded sections
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(() =>
    filterSections.reduce(
      (acc, section) => ({ ...acc, [section.title]: true }),
      {}
    )
  );

  // Reset expanded sections when filter sections change
  useEffect(() => {
    setExpandedSections(
      filterSections.reduce(
        (acc, section) => ({ ...acc, [section.title]: true }),
        {}
      )
    );
  }, [filterSections]);

  // Toggle section expansion
  const toggleSection = useCallback((title: string) => {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  }, []);

  // Render stars for ratings
  const renderStars = useCallback((rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((num) => (
          <FaStar
            key={num}
            className={`text-xs ${num <= rating ? "text-[#DB9305]" : "text-[#A5B7C4]"
              }`}
          />
        ))}
      </div>
    );
  }, []);

  const categoriesData = useSelector(categoryDataSelector);


  const handleFilterChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    section: FilterSection,
    itemName: string
  ) => {
    const foundItem = section.items.find((item) => item.name === itemName);
    if (foundItem && "filterValue" in foundItem) {
      const filterKey = section.filterKey || section.title;
      const currentFilterValue =
        sidebarFilter[filterKey as keyof SidebarFilterTypes];

      if (e.target.checked) {
        if (currentFilterValue) {
          const existingValues = String(currentFilterValue)
            .split(",")
            .map((v) => v.trim());
          if (!existingValues.includes(String(foundItem.filterValue))) {
            const newValues = [
              ...existingValues,
              String(foundItem.filterValue),
            ];
            setSidebarFilter({
              ...sidebarFilter,
              [filterKey]: newValues.join(","),
            } as SidebarFilterTypes);
          }
        } else {
          setSidebarFilter({
            ...sidebarFilter,
            [filterKey]: foundItem.filterValue,
          } as SidebarFilterTypes);
        }
      } else {
        if (currentFilterValue) {
          const existingValues = String(currentFilterValue)
            .split(",")
            .map((v) => v.trim());
          const filteredValues = existingValues.filter(
            (v) => v !== String(foundItem.filterValue)
          );

          if (filteredValues.length > 0) {
            setSidebarFilter({
              ...sidebarFilter,
              [filterKey]: filteredValues.join(","),
            } as SidebarFilterTypes);
          } else {
            const updatedFilter = {
              ...sidebarFilter,
            } as Partial<SidebarFilterTypes>;
            delete (updatedFilter as Record<string, unknown>)[filterKey];
            setSidebarFilter(updatedFilter as SidebarFilterTypes);
          }
        }
      }
    }
  }, [setSidebarFilter, sidebarFilter]);

  const isFilterChecked = useCallback((
    section: FilterSection,
    itemName: string
  ): boolean => {
    const foundItem = section.items.find((item) => item.name === itemName);
    if (foundItem && "filterValue" in foundItem) {
      const filterKey = section.filterKey || section.title;
      const currentFilterValue =
        sidebarFilter[filterKey as keyof SidebarFilterTypes];
      if (currentFilterValue) {
        const existingValues = String(currentFilterValue)
          .split(",")
          .map((v) => v.trim());
        return existingValues.includes(String(foundItem.filterValue));
      }
    }
    return false;
  }, [sidebarFilter]);

  return (
    <div
      className={`w-full  bg-white border borderColor h-full overflow-y-auto rounded-2xl ${mobileComp ? "border-none" : ""
        }`}
    >
      {filterSections.map((section) => (
        <div
          key={section.title}
          className={` ${isCoursesPage && section.title === "Categories"
            ? "hidden"
            : "border-b borderColor"
            }`}
        >
          <div
            className={`flex items-center justify-between p-4 cursor-pointer ${expandedSections[section.title]
              ? " border-b borderColor mb-4"
              : ""
              } ${isCoursesPage && section.title === "Categories" ? "hidden" : ""
              }`}
            onClick={() => toggleSection(section.title)}
            aria-label={`Toggle ${section.title} section`}
            role="button"
            tabIndex={0}
          >
            <h3 className="font-semibold">{section.title}</h3>
            {expandedSections[section.title] ? (
              <FaChevronUp />
            ) : (
              <FaChevronDown className="" />
            )}
          </div>

          {expandedSections[section.title] && (
            <div className="px-4 pb-4">
              {section.title === "Categories" && !isCoursesPage ? (
                <ul className="list-none flex flex-col gap-2">
                  {categoriesData?.map((item: CategoryDataType) => (
                    <CategoryNode key={item.id} category={{
                      id: item.id,
                      slug: item.slug,
                      name: item.name,
                      translated_name: (item as unknown as { translated_name?: string })?.translated_name,
                      all_items_count: (item as unknown as { all_items_count?: number })?.all_items_count,
                      has_subcategory: (item as unknown as { has_subcategory?: boolean })?.has_subcategory,
                      subcategories_count: (item as unknown as { subcategories_count?: number })?.subcategories_count,
                    }} />
                  ))}
                </ul>
              ) : (
                section.items.map((item, index) => {
                  const isCategory = typeof item !== "string";
                  const itemName = isCategory ? (item as Category).name : item;
                  return (
                    <div key={`${itemName}-${index}`} className="mb-2">
                      <div className="flex items-center">
                        <input
                          type={section.type || "checkbox"}
                          id={`${section.title}-${itemName}`}
                          name={section.title}
                          className={`${section.type === "radio"
                            ? "form-radio"
                            : "form-checkbox"
                            } h-4 w-4 text-indigo-600 accent-primaryBg`}
                          checked={isFilterChecked(section, itemName)}
                          onChange={(e) => {
                            handleFilterChange(e, section, itemName);
                          }}
                          aria-label={`Filter by ${section.title}: ${itemName}`}
                          tabIndex={0}
                        />
                        <label
                          htmlFor={`${section.title}-${itemName}`}
                          className="ml-2 cursor-pointer flexCenter gap-1 ellipsis"
                        >
                          {itemName}
                          {section.title === "Rating" &&
                            "filterValue" in item && (
                              <div className="flex items-center gap-2">
                                <span>
                                  {renderStars(item.filterValue as number)}
                                </span>
                                <span>({item.filterValue})</span>
                              </div>
                            )}
                        </label>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default memo(SidebarFilter);
