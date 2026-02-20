"use client";
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { BiSolidStar } from "react-icons/bi";
import SalesStatisticsChart from "@/components/instructor/dashboard/SalesStatisticsChart";
import { CourseDetail } from "@/utils/api/instructor/course/getCourseDetails";
import CustomImageTag from "@/components/commonComp/customImage/CustomImageTag";
import { formatDate, getCurrencySymbol } from "@/utils/helpers";
import CourseBadge from "@/components/commonComp/CourseBadge";
import { useTranslation } from "@/hooks/useTranslation";
import icon1 from "@/assets/images/instructorPanel/CourseDetails/earnings.svg";
import icon2 from "@/assets/images/instructorPanel/CourseDetails/enroll.svg";
import icon3 from "@/assets/images/instructorPanel/CourseDetails/ratings.svg";
import icon4 from "@/assets/images/instructorPanel/CourseDetails/sales.svg";

interface CourseStatisticsProps {
  course: CourseDetail;
}

const CourseStatistics: React.FC<CourseStatisticsProps> = ({ course }) => {

  const { t } = useTranslation();
  const courseDetails = course?.course_details;

  return (
    <>
      {/* Course Number and Publish Date */}
      <div className="flex  border-b border-gray-200 justify-between text-sm sectionBg p-3 rounded">
        <div className="mb-2 sm:mb-0 ">
          <span className="font-medium">{t("course_number")}</span>
          <br />
          <span className="font-semibold">{courseDetails?.id}</span>
        </div>
        <div className="">
          <span className="font-medium">{t("publish_date")}</span>
          <br />
          <span className="font-semibold">{formatDate(courseDetails?.created_at)}</span>
        </div>
      </div>
      {/* Course Details Card with Title and Status */}
      <Card className="mb-6 m-4 rounded-2xl">
        <CardHeader className="pb-2 pt-4 px-4 flex flex-row justify-between items-center border-b border-gray-200">
          <h3 className="text-xl font-semibold">{t("course_details")}</h3>
          <CourseBadge status={courseDetails?.status} />
        </CardHeader>

        <CardContent className="p-0">
          <div className="bg-[#010211] text-white rounded-md m-4 p-6">
            <div className="flex flex-col sm:flex-row justify-between mb-5 w-full gap-3">
              <div className="flex items-center gap-3">
                {/* Course Thumbnail Placeholder */}
                <div className="rounded-md border borderColor p-1">
                  <CustomImageTag
                    src={courseDetails?.thumbnail}
                    alt={'course thumbnail'}
                    className="w-[152px] h-[92px] object-cover"
                  />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  {courseDetails?.title}
                </h2>
              </div>

              <div className="flex-1 w-full">
                <div className="flex items-center sm:justify-end">
                  {
                    courseDetails?.course_type === 'free' ? <>
                      <div className="text-start sm:text-right mt-2 sm:mt-0 flex items-center gap-2 sm:flex-col sm:gap-0">
                        <p className="text-xl sm:text-2xl font-semibold">
                          {t("free")}
                        </p>
                      </div>
                    </>
                      :
                      <div className="text-start sm:text-right mt-2 sm:mt-0 flex items-center gap-2 sm:flex-col sm:gap-0">
                        <p className="text-xl sm:text-2xl font-semibold">
                          {getCurrencySymbol()}{courseDetails?.discounted_price.toFixed(2) || courseDetails?.price.toFixed(2)}
                        </p>
                        {courseDetails?.discounted_price && (
                          <p className="text-base lg:text-xl text-gray-400 line-through">
                            {getCurrencySymbol()}{courseDetails?.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                  }
                </div>
              </div>
            </div>

            {/* Description in separate section */}
            <p className="text-base lg:text-xl text-gray-400 mb-5 leading-relaxed">
              {courseDetails?.short_description}
            </p>

            {/* Visible divider */}
            <div className="w-full h-px bg-gray-700 mb-4"></div>

            {/* Key Information */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:justify-between gap-4 sm:gap-2">
                {/* Instructor */}
                <div className="flex items-center border-b border-gray-700 pb-4 sm:border-none sm:pb-2 xl:pb-0">
                  <div className="w-12 h-12 mr-3 rounded-full p-1 border border-white">
                    <CustomImageTag
                      src={courseDetails?.author.profile}
                      alt={'course thumbnail'}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="">
                    <p className="text-gray-400">{t("instructor")}</p>
                    <p className="text-white font-medium mt-2">
                      {courseDetails?.author.name}
                    </p>
                  </div>
                </div>

                {/* Level */}
                <div className="hidden xl:block w-px bg-gray-700 h-16 self-center"></div>
                <div className="border-b border-gray-700 pb-4 sm:border-none sm:pb-2 xl:pb-0">
                  <p className="text-gray-400">{t("level")}</p>
                  <p className="text-white font-medium mt-2 capitalize">{courseDetails?.level}</p>
                </div>

                {/* Course Duration */}
                <div className="hidden xl:block w-px bg-gray-700 h-16 self-center"></div>
                <div className="border-b border-gray-700 pb-4 sm:border-none sm:pb-2 xl:pb-0">
                  <p className="text-gray-400">{t("course_duration")}</p>
                  <p className="text-white font-medium mt-2">
                    {course?.statistics?.content_statistics?.total_duration.formatted}
                  </p>
                </div>

                {/* Course Taught */}
                <div className="hidden xl:block w-px bg-gray-700 h-16 self-center"></div>
                <div className="border-b border-gray-700 pb-4 sm:border-none sm:pb-2 xl:pb-0">
                  <p className="text-gray-400">{t("course_taught")}</p>
                  <p className="text-white font-medium mt-2">{courseDetails?.language.name}</p>
                </div>

                {/* Course Access */}
                <div className="hidden xl:block w-px bg-gray-700 h-16 self-center"></div>
                <div className="border-b border-gray-700 pb-4 sm:border-none sm:pb-2 xl:pb-0">
                  <p className="text-gray-400">{t("course_access")}</p>
                  <p className="text-white font-medium mt-2">{"Lifetime"}</p>
                </div>

                {/* Course Certificate */}
                <div className="hidden xl:block w-px bg-gray-700 h-16 self-center"></div>
                <div className="">
                  <p className="text-gray-400">{t("course_certificate")}</p>
                  <p className="text-white font-medium mt-2">
                    {courseDetails?.certificate_enabled ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Analytics Section */}
      <Card className="mt-6 m-4 rounded-2xl">
        <CardHeader className="pb-2 pt-4 px-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold">{t("course_analytics")}</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center">
            {/* Analytic Card 1: Earnings */}
            <div className="w-full sm:w-auto xl:flex-1 p-2 border-b borderColor lg:border-none">
              <div className="p-5 text-center h-full">
                <div className="w-14 h-14 bg-[#01021114] rounded-full mx-auto mb-4 flexCenter text-gray-600 text-xs">
                  <CustomImageTag src={icon1} alt="icon" className="w-8 h-8 object-contain" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">

                  {getCurrencySymbol()}{course?.statistics?.analytics.total_earnings.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  {t("earnings_from_this_course")}
                </p>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden xl:block w-px bg-gray-200 h-40 mx-2"></div>

            {/* Analytic Card 2: Enrolled Users */}
            <div className="w-full sm:w-auto xl:flex-1 p-2 border-b borderColor lg:border-none">
              <div className="p-5 text-center h-full">
              <div className="w-14 h-14 bg-[#01021114] rounded-full mx-auto mb-4 flexCenter text-gray-600 text-xs">
                  <CustomImageTag src={icon2} alt="icon" className="w-8 h-8 object-contain" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {course?.statistics?.analytics.total_enrolled_users.count}
                </p>
                <p className="text-sm text-gray-600">{t("total_enrolled_users")}</p>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden xl:block w-px bg-gray-200 h-40 mx-2"></div>

            {/* Analytic Card 3: Reviews */}
            <div className="w-full sm:w-auto xl:flex-1 p-2 border-b borderColor sm:border-none">
              <div className="p-5 text-center h-full">
              <div className="w-14 h-14 bg-[#01021114] rounded-full mx-auto mb-4 flexCenter text-gray-600 text-xs">
                  <CustomImageTag src={icon3} alt="icon" className="w-8 h-8 object-contain" />
                </div>
                <p className="text-2xl font-bold text-gray-900 flex items-center justify-center mb-1">
                  <span className="text-yellow-500 mr-1">
                    <BiSolidStar />
                  </span>{" "}
                  {courseDetails?.ratings.average}{" "}
                  <span className="text-sm font-normal text-gray-600 ml-1">
                    ({courseDetails?.ratings.count})
                  </span>
                </p>
                <p className="text-sm text-gray-600">{t("total_reviews_received")}</p>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden xl:block w-px bg-gray-200 h-40 mx-2"></div>

            {/* Analytic Card 4: Course Sales */}
            <div className="w-full sm:w-auto xl:flex-1 p-2">
              <div className="p-5 text-center h-full">
              <div className="w-14 h-14 bg-[#01021114] rounded-full mx-auto mb-4 flexCenter text-gray-600 text-xs">
                  <CustomImageTag src={icon4} alt="icon" className="w-8 h-8 object-contain" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {course?.statistics?.analytics.total_sales.count}
                </p>
                <p className="text-sm text-gray-600">{t("course_sales")}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="m-4 rounded-2xl">
        <SalesStatisticsChart data={course?.statistics?.sales_chart_data} />
      </div>
    </>
  );
};

export default CourseStatistics;
