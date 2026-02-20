"use client";
import React, { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LectureForm from "./forms/LectureForm";
import QuizModal from "./modals/QuizModal";
import AssignmentForm from "./forms/AssignmentForm";
import ResourcesForm from "./forms/ResourcesForm";
import { useTranslation } from "@/hooks/useTranslation";
import { useDispatch } from "react-redux";
import { resetAssignmentData, resetLectureData, resetQuizData, resetResourcesData } from "@/redux/instructorReducers/createCourseReducers/curriculamSlice";

export type TabType = "lecture" | "quiz" | "resources" | "assignment" | null;

interface ContentTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function ContentTabs({
  activeTab,
  setActiveTab,
}: ContentTabsProps) {

  const [quizModalOpen, setQuizModalOpen] = useState(false);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleTabChange = (value: TabType) => {
    setActiveTab(value);
    switch (value) {
      case 'lecture':
        dispatch(resetLectureData());
        break;
      case 'assignment':
        dispatch(resetAssignmentData());
        break;
      case 'resources':
        dispatch(resetResourcesData());
        break;
      default:
        break;
    }
  };

  const handleQuizTabClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuizModalOpen(true);
    dispatch(resetQuizData());
  };

  return (
    <div className="py-1">
      <div className="flex justify-between items-center sectionBg p-4 rounded-lg  flex-wrap gap-2 h-full">
        <p className="text-gray-600 text-sm">{t("start_building_your_content")}</p>

        {/* Tab System */}
        <Tabs
          defaultValue="lecture"
          value={activeTab || ''}
          onValueChange={(value: string) => { handleTabChange(value as TabType); }}
          className="w-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <TabsList
            className="grid grid-cols-2 xl:grid-cols-4 gap-2 h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <TabsTrigger
              value="lecture"
              className="flex items-center bg-white rounded-[3px]"
            >
              <BiPlus className="h-4 w-4" /> {t("lecture")}
            </TabsTrigger>
            <TabsTrigger
              value="quiz"
              className="flex items-center bg-white rounded-[3px]"
              onClick={handleQuizTabClick}
            >
              <BiPlus className="h-4 w-4" /> {t("quiz")}
            </TabsTrigger>
            <TabsTrigger
              value="assignment"
              className="flex items-center bg-white rounded-[3px]"
            >
              <BiPlus className="h-4 w-4" /> {t("assignment")}
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="flex items-center bg-white rounded-[3px]"
            >
              <BiPlus className="h-4 w-4" /> {t("resources")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Content */}
      {activeTab === "lecture" && (
        <div className="mt-4 border borderColor rounded-lg p-4">
          <LectureForm setActiveTab={setActiveTab} />
        </div>
      )}

      {/* Quiz Modal */}
      <QuizModal
        open={quizModalOpen}
        onOpenChange={setQuizModalOpen}
      />

      {activeTab === "assignment" && (
        <div className="mt-4 border borderColor rounded-lg p-4">
          <AssignmentForm setActiveTab={setActiveTab} />
        </div>
      )}

      {activeTab === "resources" && (
        <div className="mt-4 border borderColor rounded-lg p-4">
          <ResourcesForm setActiveTab={setActiveTab} />
        </div>
      )}
    </div>
  );
}
