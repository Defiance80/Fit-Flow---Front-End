import { Card } from '@/components/ui/card'
import { useTranslation } from '@/hooks/useTranslation';
import { QuizInfoType, QuizStatisticsType } from '@/utils/api/instructor/quiz/getQuizReportDetails';
import React from 'react'
import { BiChevronLeft } from 'react-icons/bi'
import icon1 from "@/assets/images/instructorPanel/quizReport/passingPoints.svg";
import icon2 from "@/assets/images/instructorPanel/quizReport/totalPoints.svg";
import icon3 from "@/assets/images/instructorPanel/quizReport/totalAttempts.svg";
import CustomImageTag from '@/components/commonComp/customImage/CustomImageTag';

interface QuizInfoProps {
    onBackClick?: () => void;
    quizInfo: QuizInfoType;
    quizStatistics: QuizStatisticsType;
    studentReportPage?: boolean;
}

const QuizInfo = ({ onBackClick, studentReportPage = true, quizInfo, quizStatistics }: QuizInfoProps) => {

    const { t } = useTranslation();

    return (
        <div>
            <div className={`${studentReportPage ? 'grid grid-cols-1 md:grid-cols-2 gap-4 my-6' : 'bg-white grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 m-4 md:m-6'}`}>
                {/* left side */}
                <Card className={`grid items-start p-4 md:p-6 ${studentReportPage && 'border-none'}`}>
                    {/* Back button */}
                    <div className="grid sm:grid-cols-[auto_auto_1fr] items-center gap-3 md:gap-6 mb-6">
                        {
                            !studentReportPage &&
                            <button
                                onClick={onBackClick}
                                className="flex items-center justify-center w-8 h-8 bg-black text-white rounded-full mt-2"
                                aria-label="Go back"
                            >
                                <BiChevronLeft size={24} />
                            </button>
                        }

                        {/* Quiz info block */}
                        <div className="text-center flexCenter w-14 md:w-16 h-16 primaryBg box-shadow-[0px_14px_28px_3px_#5A5BB529] text-white rounded-md">
                            <span className="text-lg font-bold">{quizInfo?.quiz_number}</span>
                            {/* <span className="text-sm">Quiz</span> */}
                        </div>

                        {/* Quiz details */}

                        {/* Quiz title and questions */}
                        <div className="">
                            <h2 className="text-base md:text-lg font-semibold">
                                {quizInfo?.quiz_title}
                            </h2>
                            <p className="text-gray-500 text-sm">{quizInfo?.total_questions} {t("total_questions")}</p>
                        </div>
                    </div>

                    {/* Course and Chapter details */}
                    <div className="grid gap-6 text-sm border-t pt-6 borderColor">
                        <p className="">
                            <span className="">{t("course_name")} :</span>
                            <br />
                            <span className="font-semibold">
                                {quizInfo?.course_name}
                            </span>
                        </p>
                        <p>
                            <span className="">{t("chapter_name")} :</span>
                            <br />
                            <span className="font-semibold">
                                {quizInfo?.chapter_name}
                            </span>
                        </p>
                    </div>
                </Card>

                {/* right side */}
                <Card className={`${studentReportPage ? 'grid grid-cols-3 p-4 border-none shadow-none flex-wrap w-full sectionBg gap-4' : 'grid md:grid-cols-1 grid-cols-1 sm:grid-cols-3 gap-4 border-none shadow-none'}`}>
                    {/* Passing Points */}
                    <div className={`${studentReportPage ? 'flex items-center flex-wrap gap-3 p-4 flex-col bg-white justify-center text-center rounded-md' : 'grid grid-cols-[auto_1fr] items-center gap-3 p-4 sectionBg rounded-md'}`}>
                        <div className="w-16 h-16 bg-[#83B807] rounded-[8px] flexCenter">
                            <CustomImageTag src={icon1} alt="icon" className="w-10 h-10 object-contain" />
                        </div>
                        <div>
                            <div className="font-bold">{quizStatistics?.passing_points}</div>
                            <div className="text-sm text-gray-600">{t("passing_points")}</div>
                        </div>
                    </div>

                    {/* Total Points */}
                    <div className={`${studentReportPage ? 'flex items-center flex-wrap gap-3 p-4 flex-col bg-white justify-center text-center rounded-md' : 'grid grid-cols-[auto_1fr] items-center gap-3 p-4 sectionBg rounded-md'}`}>
                        <div className="w-16 h-16 bg-[#DB9305] rounded-[8px] flexCenter">
                            <CustomImageTag src={icon2} alt="icon" className="w-10 h-10 object-contain" />
                        </div>
                        <div>
                            <div className="font-bold">{quizStatistics?.total_points}</div>
                            <div className="text-sm text-gray-600">{t("total_points")}</div>
                        </div>
                    </div>

                    {/* Total Attempts */}
                    <div className={`${studentReportPage ? 'flex items-center flex-wrap gap-3 p-4 flex-col bg-white justify-center text-center rounded-md' : 'grid grid-cols-[auto_1fr] items-center gap-3 p-4 sectionBg rounded-md'}`}>
                        <div className="w-16 h-16 bg-[#0186D8] rounded-[8px] flexCenter">
                            <CustomImageTag src={icon3} alt="icon" className="w-10 h-10 object-contain" />
                        </div>
                        <div>
                            <div className="font-bold">{quizStatistics?.total_attempts}</div>
                            <div className="text-sm text-gray-600">{t("total_attempts")}</div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default QuizInfo
