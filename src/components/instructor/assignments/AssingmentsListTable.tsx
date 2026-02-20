'use client'
import React from 'react'
import { Button } from '@/components/ui/button';
import { AssignmentDataType } from '@/utils/api/instructor/assignment/getAssignmentList';
import TableCellSkeleton from '@/components/skeletons/instrutor/TableCellSkeleton';
import DataNotFound from '@/components/commonComp/DataNotFound';
import { useTranslation } from '@/hooks/useTranslation';

interface AssignmentListProps {
  assignments: AssignmentDataType[];
  handleViewSubmission?: (assignment: AssignmentDataType) => void;
  isLoading?: boolean;
}

const AssingmentsListTable = ({ assignments, handleViewSubmission, isLoading }: AssignmentListProps) => {

  const { t } = useTranslation();
  return (
    <>
      {/* Table - wrap in div with horizontal scroll for mobile */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full border-collapse">
          <thead className="sectionBg">
            <tr className="border borderColor">
              <th className="py-3 px-4 text-left text-sm font-semibold">#</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">
                {t("assignment_name")}
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold">
                {t("course_name")}
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold">
                {t("chapter_name")}
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold">
                {t("total_points")}
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold">
                {t("action")}
              </th>
            </tr>
          </thead>
          <tbody>
            {
              isLoading ?
                <tr >
                  <td colSpan={6} className="text-center p-4">
                    <TableCellSkeleton />
                  </td>
                </tr>
                :
                assignments.length > 0 ?
                  assignments.map((assignment) => (
                    <tr key={assignment.id} className="border-b hover:bg-gray-50 borderColor last:border-b-0">
                      <td className="py-4 px-4 text-sm">{assignment.id}</td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium">{assignment.assignment_name}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm">{assignment.chapter_name}</td>
                      <td className="py-4 px-4 text-sm">{assignment.chapter_name}</td>
                      <td className="py-4 px-4 text-sm">{assignment.total_points}</td>
                      <td className="py-4 px-4">
                        <Button
                          className="bg-[var(--primary-color)] text-white text-xs !py-1 rounded-[5px]"
                          onClick={() => handleViewSubmission?.(assignment)}
                        >
                          {t("view_submission")}
                        </Button>
                      </td>
                    </tr>
                  ))
                  :
                  !isLoading &&
                  <tr>
                    <td colSpan={6} className="">
                      <DataNotFound />
                    </td>
                  </tr>
            }
          </tbody>
        </table>
      </div>

      {/* mobile view  */}
      <div className="block md:hidden">
        <div className="flex flex-col">
          {
            isLoading ?
              <div className="h-[250px] p-4">
                <TableCellSkeleton />
              </div>
              :
              assignments.length > 0 ?
                assignments.map((assignment) => (
                  <div key={assignment.id} className="border-b border-gray-200 p-4 text-sm">
                    {/* Assignment Header */}
                    <div className="mb-4">
                      {/* Index Number */}
                      <div className="text-lg font-semibold mb-2">
                        {assignment.id}
                      </div>

                      {/* Assignment Title */}
                      <h3 className="text-lg font-semibold mb-2">
                        {assignment.assignment_name}
                      </h3>
                    </div>

                    {/* Assignment Details - Two Column Layout */}
                    <div className="space-y-3 mb-4">
                      {/* Chapter Name */}
                      <div className="flex justify-between items-start border-b border-gray-200 pb-3">
                        <span className="font-semibold">{t("course_name")}:</span>
                        <span className="text-right">{assignment.chapter_name}</span>
                      </div>

                      {/* Lecture Name */}
                      <div className="flex justify-between items-start border-b border-gray-200 pb-3">
                        <span className="font-semibold">{t("chapter_name")}:</span>
                        <span className="text-right">{assignment.chapter_name}</span>
                      </div>

                      {/* Total Points */}
                      <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                        <span className="font-semibold">{t("total_points")}:</span>
                        <span className="font-semibold">{assignment.total_points}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-start">
                      <Button
                        className="bg-[var(--primary-color)] text-white px-6 py-2 rounded"
                        onClick={() => handleViewSubmission?.(assignment)}
                      >
                        {t("view_submission")}
                      </Button>
                    </div>
                  </div>
                ))
                :
                !isLoading &&
                <DataNotFound />
          }
        </div>
      </div>
    </>
  )
}

export default AssingmentsListTable
