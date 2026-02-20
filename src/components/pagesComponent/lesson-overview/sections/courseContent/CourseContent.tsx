'use client'
import React, { useState } from 'react';
import CourseSection from '@/components/pagesComponent/courseDetails/sections/CourseSection';
import { IoClose } from 'react-icons/io5';
import { Chapter, Course } from '@/utils/api/user/getCourse';

interface CourseContentProps {
  courseData: Course;
  isSequentialAccess?: boolean;
  handleCourseCurriculumOpen?: () => void;
}

const CourseContent: React.FC<CourseContentProps> = ({ courseData, isSequentialAccess, handleCourseCurriculumOpen }) => {
  const chapters = courseData.chapters;
  const [expandAll, setExpandAll] = useState<boolean>(false);

  const toggleExpandAll = (): void => {
    setExpandAll(!expandAll);
    handleCourseCurriculumOpen?.();
  };

  return (
    <div className="flex flex-col lg:flex-row w-full rounded-lg overflow-hidden">
      {/* Course Curriculum Section */}
      <div className="w-full space-y-4 md:space-y-0 ">
        <div className="py-4 md:py-8 border-b borderColor">
          <div className="flex justify-between items-center px-4">
            <h2 className="text-lg md:text-xl font-bold">Course Curriculum</h2>
            <button
              onClick={toggleExpandAll}
              className="cursor-pointer bg-[#F8F8F9] flexCenter rounded-[8px] w-[32px] h-[32px] border borderColor p-1"
            >
              <IoClose size={24} color="#A2A2A5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 max-479:p-2 p-4 rounded-2xl">
          {chapters.map((chapter) => (
            <CourseSection
              key={chapter.id}
              chapter={chapter as Chapter}
              isExpandAll={expandAll}
              isFirstSection={chapters[0].id === chapter.id}
              lessonOverviewPage={true}
              isSequentialAccess={isSequentialAccess}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseContent; 