'use client'
import { useTranslation } from '@/hooks/useTranslation';
import { AssignmentType } from '@/utils/api/instructor/assignment/getAssignmentSubmissions';
import React from 'react'
import { BiArrowBack } from 'react-icons/bi'

interface AssignmentsInfoProps {
  onBack?: () => void;
  assignmentDetails?: AssignmentType | undefined;
}

const AssignmentsInfo = ({ onBack, assignmentDetails }: AssignmentsInfoProps) => {

  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* left side */}
        <div className="flex sm:items-center gap-4 flex-col sm:flex-row sm:gap-2 w-full">
          {
            onBack &&
            <div
              className="bg-black rounded-full w-10 h-10 flex items-center justify-center mr-4 cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={onBack}
              role="button"
              tabIndex={0}
              aria-label="Go back"
              onKeyDown={(e) => e.key === "Enter" && onBack?.()}
            >
              <span className="text-white">
                <BiArrowBack size={20} />
              </span>
            </div>
          }
          <div>
            <h3 className="font-medium text-base">
              {`${assignmentDetails?.id}. ${assignmentDetails?.title}`}
            </h3>
          </div>
        </div>

        {/* right side */}
        <div className="flex sm:flex-col sm:ml-0 justify-between w-full sm:justify-end sm:items-end">
          <div className="flex sm:flex-col">
            <span className="text-gray-600 mr-2 text-sm">{t("total_points")}</span>
            <span className="font-medium">
              {Number(assignmentDetails?.points).toFixed(0)}
            </span>
          </div>
        </div>
      </div>

      {/* divider */}
      <div className="border-t border-gray-200"></div>

      {/* Assignment Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        <div className="p-3 sectionBg rounded-[8px]">
          <div className="text-gray-600 mb-1">{t("assignment_name")}</div>
          <div className="font-medium">
            {assignmentDetails?.title}
          </div>
        </div>
        <div className="p-3 sectionBg rounded-[8px]">
          <div className="text-gray-600 mb-1">{t("chapter_name")} :</div>
          <div className="font-medium">
            {assignmentDetails?.chapter?.title}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssignmentsInfo
