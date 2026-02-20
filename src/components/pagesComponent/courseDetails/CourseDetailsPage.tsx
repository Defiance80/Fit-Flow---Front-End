"use client";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import CourseDescriptionSection from "./sections/CourseDescriptionSection";
import CourseCertificate from "./sections/CourseCertificate";
import CourseInstructor from "./sections/CourseInstructor";
import CoursePurchaseCard from "./sections/CoursePurchaseCard";
import breadcrumbsBg from "@/assets/images/courseDetailBreadcrumbg.jpg";
import { FaStar } from "react-icons/fa";
import MainLoader from "@/components/Loaders/MainLoader";
import { useTranslation } from '@/hooks/useTranslation';
import { Course } from "@/utils/api/user/getCourse";
import InstructorCourses from "../instructorDetail/sections/InstructorCourses";
import CustomImageTag from "@/components/commonComp/customImage/CustomImageTag";
import CourseCurriculam from "./sections/CourseCurriculam";
import ReviewSection from "../lesson-overview/sections/tabsSection/review/ReviewSection";
import OpenInAppPopUp from "@/components/commonComp/OpenInAppPopUp";
import { courseView } from "@/utils/api/user/courseView";
import { useSelector } from "react-redux";
import { isLoginSelector } from "@/redux/reducers/userSlice";

interface CourseDetailsPageProps {
  courseData: Course;
}

const CourseDetailsPage: React.FC<CourseDetailsPageProps> = ({ courseData }) => {

  const { t } = useTranslation();
  const isLogin = useSelector(isLoginSelector);

  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    if (courseData) {
      setLoading(false);
    }
  }, [courseData]);

  // instructor reviews & rating
  const instructorReviews = courseData?.instructor?.reviews;


  const [isSticky, setIsSticky] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const instructorTopCoursesRef = useRef<HTMLDivElement>(null);

  const handleCourseView = async () => {
    const response = await courseView({
      course_id: courseData?.id,
    });
    if (response) {
      if (response.error) {
        console.log(response.message);
      }
    }
  };

  useEffect(() => {
    if (isLogin) {
      handleCourseView();
    }
  }, [isLogin]);


  useEffect(() => {
    // Check if window is available (client-side only)
    if (typeof window !== "undefined" && window.innerWidth >= 1200) {
      const handleScroll = () => {
        if (containerRef.current && instructorTopCoursesRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const instructorTopCoursesRect =
            instructorTopCoursesRef.current.getBoundingClientRect();
          const threshold = 100; // Adjust as needed

          // Check if we've scrolled to the InstructorTopCourses section
          if (instructorTopCoursesRect.top <= window.innerHeight) {
            setIsSticky(false);
          } else if (containerRect.top <= threshold) {
            setIsSticky(true);
          } else {
            setIsSticky(false);
          }
        }
      };
      window.addEventListener("scroll", handleScroll);
      // Initialize on component mount
      handleScroll();

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []); // Remove window?.innerWidth from dependency array

  // Loading state
  if (loading && isClient) {
    return (
      <Layout>
        <MainLoader />
      </Layout>
    );
  }

  // Error state
  if (!courseData) {
    return (
      <Layout>
        <div className="commonGap">
          <div className="container flex flex-col justify-center items-center min-h-[600px] space-y-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              {t("course_not_found")}
            </h1>
            <p className="text-gray-600">
              {t("the_course_you_are_looking_for_does_not_exist")}
            </p>
            <Link href="/courses" className="commonBtn">
              {t("browse_all_courses")}
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="commonGap">
        <div
          style={{ backgroundImage: `url(${breadcrumbsBg.src})` }}
          className="bg-cover bg-center"
        >
          <div className="bg-[#010211CC] py-8 md:py-12">
            <div className="container space-y-4">
              <div className="bg-white rounded-full py-2 px-4 w-max flexCenter gap-1">
                <Link href={"/"} className="primaryColor" title={t("home")}>
                  {t("home")}
                </Link>
                <span>
                  <MdKeyboardArrowRight size={22} />
                </span>
                <Link
                  href={"/courses"}
                  className="primaryColor"
                  title={t("courses")}
                >
                  {t("courses")}
                </Link>
                <span>
                  <MdKeyboardArrowRight size={22} />
                </span>
                <span>{courseData.category_name || t("course")}</span>
              </div>
              <div className="flexColCenter items-start gap-2 text-white">
                <h1 className="font-semibold text-2xl sm:text-3xl md:text-3xl lg:text-[40px] between-1200-1399:w-[55%]">
                  {courseData.title}
                </h1>
                <p className="sectionPara lg:w-[52%] opacity-[76%]">
                  {courseData.short_description}
                </p>
              </div>
              <div
                className="flex items-center text-white gap-6 text-sm md:text-base flex-wrap"
                ref={containerRef}
              >
                <div className="flex items-center gap-2">
                  <div className="w-[40px] h-[40px] rounded-full overflow-hidden border border-white p-[2px]">
                    <CustomImageTag
                      src={courseData.instructor?.avatar}
                      alt={t("instructor")}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="opacity-60">{t("instructor")}</span>
                    <span>
                      {
                        courseData?.instructor?.instructor_type === "team"
                          ? courseData?.instructor?.team_name
                          : courseData?.instructor?.instructor_type === "individual"
                            ? courseData?.instructor?.name
                            : courseData?.instructor?.name || ""
                      }
                    </span>

                  </div>
                </div>
                <div className="border h-[40px] w-[1px] borderColor opacity-30" />

                <div className="flex flex-col gap-1">
                  <span className="opacity-60">{t("level")}</span>
                  <span className="capitalize">{courseData.level}</span>
                </div>
                <div className="border h-[40px] w-[1px] borderColor opacity-30" />
                <div className="flex flex-col gap-1">
                  <span className="opacity-60">{t("course_type")}</span>
                  <span className="capitalize">{courseData.course_type}</span>
                </div>
                <div className="border h-[40px] w-[1px] borderColor opacity-30" />
                <div className="flex flex-col gap-1">
                  <span className="opacity-60">{t("language")}</span>
                  <span>{courseData.language || t("english")}</span>
                </div>
                <div className="border h-[40px] w-[1px] borderColor opacity-30" />
                <div className="flex flex-col gap-1">
                  <span className="opacity-60">{t("ratings")}</span>
                  <span className="flex items-center gap-1">
                    <FaStar color="#DB9305" size={16} />
                    {courseData.ratings}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mb-12">
          <div className="grid grid-cols-12 max-575:gap-y-10 between-1200-1399:gap-y-20 max-1199:gap-y-20 gap-6">
            <div className="max-1199:col-span-12 col-span-8 flex flex-col gap-6 lg:gap-12">
              <CourseDescriptionSection courseData={courseData} />
              <CourseCertificate />
              <CourseCurriculam courseData={courseData} />
              <CourseInstructor
                name={courseData?.instructor?.instructor_type === "team"
                  ? courseData?.instructor?.team_name
                  : courseData?.instructor?.instructor_type === "individual"
                    ? courseData?.instructor?.name
                    : courseData?.instructor?.name || ""}
                title={t("course_instructor")}
                rating={instructorReviews?.average_rating}
                reviews={instructorReviews?.total_reviews}
                profileImage={courseData.instructor?.avatar || ''}
                aboutMe={courseData.instructor?.about_me || ''}
                skills={courseData.instructor?.skills}
              />
              {/* <ReviewsSect/> */}
              <ReviewSection courseDetailsPage={true} />
            </div>
            <div
              className={`max-1199:col-span-12 col-span-4 max-1199:block between-1200-1399:block flex items-start justify-end  max-1199:w-full between-1200-1399:w-full`}
            >
              <CoursePurchaseCard
                isSticky={isSticky}
                courseData={courseData}
              />
            </div>
          </div>
        </div>
        <div className="mt-10" ref={instructorTopCoursesRef}>
          <InstructorCourses
            instructorSlug={courseData.instructor?.slug || 'admin-slug'}
            sectionTitle="Top Instructor Courses"
            currentCourseId={courseData.id}
          />
        </div>
        <OpenInAppPopUp />
      </div>
    </Layout>
  );
};

export default CourseDetailsPage;
