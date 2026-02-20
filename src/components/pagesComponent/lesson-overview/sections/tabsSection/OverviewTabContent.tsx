import React from 'react'
import { FaStar, FaCheck } from 'react-icons/fa'
import { Course } from '@/utils/api/user/getCourse';
import {
    FaBookOpen,
    FaPlayCircle,
    FaClock,
    FaGraduationCap,
    FaGlobe,
    FaLock,
} from 'react-icons/fa';
import CustomImageTag from '@/components/commonComp/customImage/CustomImageTag';
import RichTextContent from '@/components/commonComp/RichText';
import { useTranslation } from '@/hooks/useTranslation';

interface OverviewTabContentProps {
    courseData: Course;
}

const OverviewTabContent: React.FC<OverviewTabContentProps> = ({ courseData }) => {

    const { t } = useTranslation();

    return (
        <div className="p-4 md:p-8">
            <div className='grid grid-cols-12 border-b borderColor pb-4 gap-y-6 md:gap-3'>
                <div className='col-span-12 order-2 md:order-1 md:col-span-8'>
                    {/* Title and Basic Info */}
                    <h1 className="text-2xl font-normal mb-4">{courseData.title}</h1>

                    <div className="flex flex-wrap gap-6 mb-6 text-sm">
                        <div className="flex items-center flex-col gap-1">
                            <span className='opacity-75 text-sm'>{t("rating")}</span>
                            <div className='flex items-center'>
                                <FaStar className="text-[#DB9305] mr-1" />
                                <span className="font-medium">{courseData.ratings}</span>
                            </div>
                        </div>
                        <div className='border borderColor' />
                        <div className="flex flex-col gap-1">
                            <span className='opacity-75 text-sm'>{t("enrolled_students")}</span>
                            <span className="font-medium">{courseData.enroll_students}</span>
                        </div>
                        <div className='border borderColor' />
                        <div className="flex items-center flex-col gap-1">
                            <span className='opacity-75 text-sm'>{t("last_update")}</span>
                            <span className="font-medium">{courseData.last_updated}</span>
                        </div>
                    </div>

                    {/* About Course */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">{t("about_course")}</h2>
                        <div className="text-gray-700 whitespace-pre-line">
                            {courseData.short_description}
                        </div>
                    </div>
                    {/* Course Includes - Mobile Only */}
                    <div className="bg-gray-100 p-6 rounded-2xl max-w-md w-full mx-auto block md:hidden">
                        <h3 className="text-lg font-semibold mb-5">{t("course_includes")}</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <span><FaBookOpen /></span>
                                <span className="text-gray-800 text-sm md:text-base">{courseData.chapter_count} {t("chapters")}</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span><FaPlayCircle /></span>
                                <span className="text-gray-800 text-sm md:text-base">{courseData.lecture_count} {t("lectures")}</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span><FaClock /></span>
                                <span className="text-gray-800 text-sm md:text-base">{courseData.total_duration_formatted} {t("course_duration")}</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span><FaGraduationCap /></span>
                                <span className="text-gray-800 text-sm md:text-base">{t("skill_level")} {courseData.level}</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span><FaGlobe /></span>
                                <span className="text-gray-800 text-sm md:text-base">{t("taught_in")} {courseData.language}</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span><FaLock /></span>
                                <span className="text-gray-800 text-sm md:text-base">{t("lifetime_access")}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* Course Includes - Desktop Only */}
                <div className='col-span-12 order-1 md:order-2 md:col-span-4 hidden md:block'>
                    <div className="hidden md:block bg-gray-100 p-6 rounded-2xl max-w-md w-full mx-auto">
                        <h3 className="text-lg font-semibold mb-5">{t("course_includes")}</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <span><FaBookOpen /></span>
                                <span className="text-gray-800 text-sm md:text-base">{courseData.chapter_count} {t("chapters")}</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span><FaPlayCircle /></span>
                                <span className="text-gray-800 text-sm md:text-base">{courseData.lecture_count} {t("lectures")}</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span><FaClock /></span>
                                <span className="text-gray-800 text-sm md:text-base">{courseData.total_duration_formatted} {t("course_duration")}</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span><FaGraduationCap /></span>
                                <span className="text-gray-800 text-sm md:text-base">{t("skill_level")} {courseData.level}</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span><FaGlobe /></span>
                                <span className="text-gray-800 text-sm md:text-base">{t("taught_in")} {courseData.language}</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span><FaLock /></span>
                                <span className="text-gray-800 text-sm md:text-base">{t("lifetime_access")}</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
            {/* What You'll Learn */}
            <div className="mb-8 border-b borderColor py-4 md:py-6">
                <h2 className="text-xl font-semibold mb-3">{t("what_you_ll_learn")}</h2>
                <ul className="space-y-2">
                    {courseData.learnings.map((learning, index) => (
                        <li key={index} className="flex items-start">
                            <FaCheck className="primaryColor mt-1 mr-2 flex-shrink-0" />
                            <span>{learning.title}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Requirements */}
            <div className="mb-8 border-b borderColor py-4 md:py-6">
                <h2 className="text-xl font-semibold mb-3">{t("requirements")}</h2>
                <ul className="space-y-2">
                    {courseData.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                            <FaCheck className="primaryColor mt-1 mr-2 flex-shrink-0" />
                            <span>{requirement.requirement}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Instructor */}
            <div className="mb-8 p-4 sectionBg rounded-lg">
                <h2 className="text-xl font-semibold mb-4">{t("instructor")}</h2>
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden border p-1">
                        <CustomImageTag
                            src={courseData.instructor.avatar}
                            alt={courseData.instructor.name}
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>

                    <div className=''>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-medium">
                                {
                                    courseData?.instructor?.instructor_type === "team"
                                        ? courseData?.instructor?.team_name
                                        : courseData?.instructor?.instructor_type === "individual"
                                            ? courseData?.instructor?.name
                                            : courseData?.instructor?.name || ""
                                }
                            </h3>
                            <div className="flex items-center text-sm">
                                <FaStar className="text-[#DB9305] mr-1" />
                                <span>{courseData.instructor.reviews?.average_rating}</span>
                                <span className="text-gray-500 ml-1">({courseData.instructor.reviews?.total_reviews} {t("reviews")})</span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mt-2 md:mt-0">{courseData.instructor.name}</p>
                    </div>
                </div>
            </div>

            {/* I'm a / What I Do */}
            <div className="mb-4">
                <div className="mb-4">
                    <div className="text-gray-700">
                        <RichTextContent content={courseData.instructor.about_me || ''} />
                    </div>
                </div>
            </div>

            <button className="primaryColor font-medium flex items-center mt-4">
                + {t("read_more")}
            </button>
        </div>
    )
}

export default OverviewTabContent
