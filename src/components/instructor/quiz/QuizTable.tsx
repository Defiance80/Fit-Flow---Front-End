'use client'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import React from 'react'
import { QuizReportDataType } from '@/utils/api/instructor/quiz/getQuizResports'
import TableCellSkeleton from '@/components/skeletons/instrutor/TableCellSkeleton'
import DataNotFound from '@/components/commonComp/DataNotFound'
import { useTranslation } from '@/hooks/useTranslation';

interface QuizTableProps {
  isLoading: boolean;
  quizzes: QuizReportDataType[];
  handleViewAttempts: (quiz: QuizReportDataType) => void;
}

const QuizTable = ({ quizzes, handleViewAttempts, isLoading }: QuizTableProps) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="overflow-x-auto  hidden md:block">
        <table className="w-full">
          {/* Table header */}
          <thead className="sectionBg border-y borderColor">
            <tr>
              <th className="px-4 py-3 text-left w-12 font-medium">#</th>
              <th className="px-4 py-3 text-left font-medium">{t("quiz_name")}</th>
              <th className="px-4 py-3 text-left font-medium">{t("course_name")}</th>
              <th className="px-4 py-3 text-left font-medium">{t("chapter_name")}</th>
              <th className="px-4 py-3 text-left font-medium">{t("action")}</th>
            </tr>
          </thead>

          {/* Table body */}
          <tbody>
            {
              isLoading ?
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    <TableCellSkeleton />
                  </td>
                </tr>
                :
                quizzes.length > 0 ?
                  quizzes.map((quiz) => (
                    <tr key={quiz.id} className="border-t borderColor">
                      <td className="px-4 py-4">{quiz.id}</td>
                      <td className="px-4 py-4">
                        <div className="font-semibold">{quiz.quiz_name}</div>
                        <div className="text-sm text-gray-800">
                          {quiz.total_questions} {t("total_questions")}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm">{quiz.course_name}</td>
                      <td className="px-4 py-4 text-sm">{quiz.chapter_name}</td>
                      <td className="px-4 py-4">
                        <Button

                          size="sm"
                          className="text-white primaryBg"
                          onClick={() => handleViewAttempts(quiz)}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          {t("view_attempts")}
                        </Button>
                      </td>
                    </tr>
                  ))
                  :
                  !isLoading &&
                  <tr>
                    <td colSpan={5} className="text-center p-4">
                      <DataNotFound />
                    </td>
                  </tr>
            }
          </tbody>
        </table>
      </div>

      {/* mobile view  */}
      <div className="block md:hidden mt-1 border-t borderColor">
        <div className="flex flex-col">
          {
            isLoading ?
              <div className="p-4">
                <TableCellSkeleton />
              </div>
              :
              quizzes.length > 0 ?
                quizzes.map((quiz) => (
                  <div key={quiz.id} className="border-b borderColor p-4">
                    {/* Quiz Header */}
                    <div className="mb-4">
                      {/* Index Number */}
                      <div className="text-gray-900 mb-2">
                        {quiz.id}
                      </div>

                      {/* Quiz Title */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {quiz.quiz_name}
                      </h3>

                      {/* Question Count */}
                      <div className="text-sm text-gray-500 mb-4">
                        {quiz.total_questions} {t("total_questions")}
                      </div>
                    </div>

                    {/* Quiz Details - Two Column Layout */}
                    <div className="space-y-3 mb-4">
                      {/* Course Name */}
                      <div className="grid grid-cols-2">
                        <span className="font-semibold">{t("course_name")}:</span>
                        <span className="">{quiz.course_name}</span>
                      </div>

                      {/* Chapter Name */}
                      <div className="grid grid-cols-2">
                        <span className="font-semibold">{t("chapter_name")}:</span>
                        <span className="">{quiz.chapter_name}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-start">
                      <Button
                        size="sm"
                        className="bg-[var(--primary-color)] text-white px-4 py-2 rounded flex items-center"
                        onClick={() => handleViewAttempts(quiz)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {t("view_attempts")}
                      </Button>
                    </div>
                  </div>
                ))
                :
                !isLoading &&
                <div className="">
                  <DataNotFound />
                </div>
          }
        </div>
      </div>
    </div>
  )
}

export default QuizTable
