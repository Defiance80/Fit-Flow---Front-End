"use client";
import React, { useEffect, useState } from "react";
import VideoSect from "./sections/courseTyes/VideoSect";
import CourseContent from "./sections/courseContent/CourseContent";
import TabSect from "./sections/tabsSection/TabSect";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import QuizPlay from "./sections/courseTyes/quizPlay/QuizPlay";
import Footer from "@/components/layout/Footer";
import { Course } from "@/utils/api/user/getCourse";
import { useDispatch, useSelector } from "react-redux";
import { currentCourseIdSelector, isCurriculumItemCompletedSelector, previouslyCompletedCurriculumsIdsSelector, resetLessonOverviewData, selectedCurriculumChapterIdSelector, selectedCurriculumItemSelector, setCurrentCourseId, setCurrentCurriculumId, setIsCurriculumItemCompleted, setPreviouslyCompletedCurriculumsIds, setSelectedCurriculumChapterId } from "@/redux/reducers/helpersReducer";
import FileSect from "./sections/courseTyes/FileSect";
import AssignmentSect from "./sections/courseTyes/AssignmentSect";
import FormSubmitLoader from "@/components/Loaders/FormSubmitLoader";
import { extractErrorMessage } from "@/utils/helpers";
import toast from "react-hot-toast";
import { curriculumMarkComplete } from "@/utils/api/user/lesson-overview/curriculumMarkComplete";
import ShareCourseModal from "@/components/modals/ShareCourseModal";
import { PiListBold } from "react-icons/pi";
import { settingsSelector } from "@/redux/reducers/settingsSlice";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

interface LessonOverviewProps {
  courseData: Course;
}

const LessonOverview: React.FC<LessonOverviewProps> = ({ courseData }) => {

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentCurriculumId = courseData?.current_curriculum?.model_id;
  const currentChapterId = courseData?.current_curriculum?.chapter_id
  const selectedCurriculumItem = useSelector(selectedCurriculumItemSelector);
  const selectedCurriculumChapterId = useSelector(selectedCurriculumChapterIdSelector);
  const isCurriculumItemCompleted = useSelector(isCurriculumItemCompletedSelector);
  const previouslyCompletedCurriculumsIds = useSelector(previouslyCompletedCurriculumsIdsSelector);
  const currentCourseId = useSelector(currentCourseIdSelector);
  const router = useRouter();

  const isSequentialAccess = courseData?.sequential_access;

  const settings = useSelector(settingsSelector);

  const [isLoading, setIsLoading] = useState(false);
  const isQuizPage = selectedCurriculumItem?.type === 'quiz';
  const isLecturePage = selectedCurriculumItem?.type === 'lecture';
  const isAssignmentPage = selectedCurriculumItem?.type === 'assignment';
  const isDocumentPage = selectedCurriculumItem?.type === 'document';

  const [isCourseCurriculumOpen, setIsCourseCurriculumOpen] = useState(false);

  const handleCourseCurriculumOpen = () => {
    setIsCourseCurriculumOpen(!isCourseCurriculumOpen);
  }

  useEffect(() => {
    if (settings) {
      document.documentElement.style.setProperty('--primary-color', settings?.data?.system_color || '#5a5bb5')
      // Set favicon from settings API
      if (settings?.data?.favicon) {
        const favicon: HTMLLinkElement = document.querySelector('link[rel="icon"]') as HTMLLinkElement || document.createElement("link") as HTMLLinkElement;
        favicon.rel = "icon";
        favicon.href = settings?.data?.favicon;
        if (!document.querySelector('link[rel="icon"]')) {
          document.head.appendChild(favicon);
        }
      }
    }
  }, [settings]);

  useEffect(() => {
    if (currentCourseId !== courseData?.id) {
      dispatch(resetLessonOverviewData());
      dispatch(setCurrentCourseId(courseData?.id));
      dispatch(setPreviouslyCompletedCurriculumsIds([]));
    }
  }, [courseData]);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [selectedCurriculumItem]);

  useEffect(() => {
    if (currentCurriculumId) {
      dispatch(setCurrentCurriculumId(currentCurriculumId));
    }
    if (!selectedCurriculumChapterId) {
      dispatch(setSelectedCurriculumChapterId(currentChapterId));
    }
  }, [currentCurriculumId, currentChapterId]);


  const markCurriculumItemCompleted = async () => {
    try {
      // Call the start quiz API
      const response = await curriculumMarkComplete({
        course_chapter_id: selectedCurriculumChapterId as number,
        model_id: selectedCurriculumItem?.id as number,
        model_type: selectedCurriculumItem?.type as "lecture" | "quiz" | "assignment" | "document",
      });

      if (response) {
        // Check if API returned an error (error: true in response)
        if (response.error) {
          console.log("API error:", response.message);
          toast.error(response.message || "Failed to mark curriculum item completed");
        }
        else {
          toast.success("Curriculum item completed successfully");
          dispatch(setIsCurriculumItemCompleted({ completed: false, itemId: selectedCurriculumItem?.id as number, isNextItem: true }));
          dispatch(setPreviouslyCompletedCurriculumsIds([...(previouslyCompletedCurriculumsIds || []), selectedCurriculumItem?.id as number]));
          dispatch(setCurrentCurriculumId(response.data?.next_curriculum.next_model_id as number));
        }

      } else {
        console.log("response is null in component", response);
      }
    } catch (error) {
      extractErrorMessage(error);
    }
  }

  const isIdIncludes = previouslyCompletedCurriculumsIds?.includes(selectedCurriculumItem?.id as number)

  useEffect(() => {
    if (isCurriculumItemCompleted.completed && !isIdIncludes) {
      markCurriculumItemCompleted();
    }
    else {
      if (isCurriculumItemCompleted.completed && selectedCurriculumItem?.is_completed) {
        dispatch(setIsCurriculumItemCompleted({ completed: false, isNextItem: true }));
      }
    }
  }, [isCurriculumItemCompleted]);

  useEffect(() => {
    if (selectedCurriculumItem?.type === 'document' && !selectedCurriculumItem?.is_completed) {
      markCurriculumItemCompleted();
    }
  }, [selectedCurriculumItem]);

  const handleBack = () => {
    dispatch(resetLessonOverviewData());
    router.back();
  }


  return (
    <>
      <div>
        <div className="grid grid-cols-12 max-575:gap-y-8 between-1200-1399:gap-y-20 max-1199:gap-y-20 mb-12 ">
          {/* letf side content */}
          <div className={`max-1199:col-span-12  ${isCourseCurriculumOpen ? 'col-span-12' : 'col-span-8'} border-r borderColor flex flex-col gap-y-4 md:gap-y-8`}>
            {/* video section */}
            <div className="relative sectionBg">
              <div className="relative w-full">
                {/* header */}
                <div className="bg-[#010211] p-4 md:p-6 flex items-center justify-between border-b border-white text-white  ">
                  <div className="flex items-center">
                    <button className="mr-4 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50"
                      onClick={() => handleBack()}
                    >
                      <FaArrowLeft className="text-white text-sm" />
                    </button>
                    <div>
                      <h1 className="text-lg md:text-xl font-semibold">{courseData?.title}</h1>
                      <p className="text-sm text-gray-300 capitalize">
                        {t("by")} {""}

                        {
                          courseData?.instructor?.instructor_type === "team" ?
                            <span>{courseData?.instructor?.team_name}</span> :
                            courseData?.author_name !== 'admin' ? (
                              <Link href={`/instructor/${courseData?.author_name}`} className="underline">{courseData?.author_name}</Link>
                            ) : (
                              <span>{courseData?.author_name}</span>
                            )
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flexCenter gap-2">
                    <ShareCourseModal courseTitle={courseData?.title} courseSlug={courseData?.slug} />
                    {isCourseCurriculumOpen &&
                      <button
                        onClick={handleCourseCurriculumOpen}
                        className="max-[1200px]:hidden"
                      >
                        <PiListBold size={20}
                          className="cursor-pointer"
                        />
                      </button>
                    }
                  </div>
                </div>

                {/* content here*/}
                {
                  isLoading ? (
                    <div className="w-full min-h-[356px] sm:min-h-[486px] md:min-h-[686px] flexColCenter">
                      <FormSubmitLoader primaryBorder={true} />
                    </div>
                  )
                    :
                    isQuizPage ? <QuizPlay /> : isLecturePage ? <VideoSect /> : isAssignmentPage ? <AssignmentSect /> : isDocumentPage ? <FileSect /> : null
                }

              </div>
            </div>

            <TabSect courseData={courseData} />
          </div>

          <div className={`max-1199:col-span-12 max-[1200px]:block ${isCourseCurriculumOpen ? 'hidden' : 'col-span-4'}`}>
            <CourseContent
              courseData={courseData}
              isSequentialAccess={isSequentialAccess}
              handleCourseCurriculumOpen={handleCourseCurriculumOpen}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>

  );
};

export default LessonOverview;
