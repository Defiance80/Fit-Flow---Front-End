"use client"
import { CategoryDataType } from '@/types'
import Link from 'next/link'
import React from 'react'
import { FiArrowRight } from "react-icons/fi";
import CustomImageTag from '../commonComp/customImage/CustomImageTag'
import { useTranslation } from "@/hooks/useTranslation";

interface dataProps {
    data: CategoryDataType
}

const CategoryCard: React.FC<dataProps> = ({ data }) => {
    const { t } = useTranslation();
    return (
        <div className='flex flex-col gap-4 rounded-[16px] border borderColor p-4 group transition-all duration-300 hover:bg-white hover:shadow-[0px_14px_36px_3px_#ADB3B852]'
            key={data?.id}>
            <CustomImageTag src={data?.image} alt='category-img' className='w-[64px] md:w-[72px] h-[64px] md:h-[72px] rounded-[8px]' />
            <div className='flex flex-col gap-2'>
                <span className='text-lg md:text-xl font-semibold line-clamp-1'>{data?.name}</span>
                {
                    data?.courses_count > 0 &&
                    <>
                        {/* Mobile view shows count and link without hover for quick access */}
                        <div className='flex items-center justify-between md:hidden'>
                            <span className='secondaryColor'>{data?.courses_count}</span>
                            <Link href={`/courses/${data?.slug}`} title='View Courses' className='primaryColor flex items-center gap-1'>
                                <span>{t("view_courses")}</span>
                                <FiArrowRight />
                            </Link>
                        </div>
                        {/* Desktop view keeps hover animation for count and link reveal */}
                        <div className='relative h-[20px] overflow-hidden hidden md:flex md:flex-col'>
                            <span className='secondaryColor group-hover:mt-12 transition-all duration-500'>{data?.courses_count}</span>
                            <div className='-mb-12 group-hover:-mt-[72px] transition-all duration-500 flex items-center'>
                                <Link href={`/courses/${data?.slug}`} title='View Courses' className='primaryColor flex items-center gap-1 group-hover:'>
                                    <span>{t("view_courses")}</span>
                                    <span className='block w-[2px] overflow-hidden group-hover:w-[200px] group-hover:overflow-visible transition-all duration-300'>
                                        <FiArrowRight />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </>
                }
            </div>

        </div>
    )
}

export default CategoryCard