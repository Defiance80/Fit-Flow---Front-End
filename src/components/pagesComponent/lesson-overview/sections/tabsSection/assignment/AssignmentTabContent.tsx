"use client";
import React, { useEffect, useState } from 'react'
import AllAssignment from './AllAssignment';
import CurrentAssignment from './CurrentAssignment';
import { useSelector } from 'react-redux';
import { getAssignments, AssignmentsData } from '@/utils/api/user/lesson-overview/assignment/getAssignments';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '@/utils/helpers';
import AssignmentSkeleton from '@/components/skeletons/lesson-overview/AssignmentSkeleton';
import { selectedCurriculumChapterIdSelector } from '@/redux/reducers/helpersReducer';
import { useTranslation } from '@/hooks/useTranslation';

type Tab = {
    title: string;
}

interface AssignmentTabContentProps {
    courseId: number;
}

const AssignmentTabContent: React.FC<AssignmentTabContentProps> = ({ courseId }) => {

    const { t } = useTranslation();
    const selectedCurriculumChapterId = useSelector(selectedCurriculumChapterIdSelector);

    // State for assignments data
    const [assignmentsData, setAssignmentsData] = useState<AssignmentsData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [activeTab, setActiveTab] = useState<string>('Current Chapter Assignment');

    const tabs: Tab[] = [
        {
            title: t("current_chapter_assignment"),
        },
        {
            title: t("all_assignment"),
        },
    ]

    // Function to fetch assignments
    const fetchAssignments = async () => {
        setIsLoading(true);
        try {
            const response = await getAssignments({ course_id: courseId, chapter_id: selectedCurriculumChapterId as number });
            if (response) {
                if (!response.error) {
                    if (response.data) {
                        setAssignmentsData(response.data);
                    }
                    else {
                        setAssignmentsData(null);
                    }
                } else {
                    console.log("API error:", response.message);
                    toast.error(response.message || "Failed to fetch assignments");
                    setAssignmentsData(null);
                }
            } else {
                console.log("response is null", response);
                setAssignmentsData(null);
            }
        } catch (error) {
            extractErrorMessage(error);
            setAssignmentsData(null);
        } finally {
            setIsLoading(false);
        }
    }

    // useEffect to fetch assignments
    useEffect(() => {
        if (courseId) {
            fetchAssignments();
        }
    }, [courseId, activeTab]);

    return (
        <div>
            <div className='px-4 md:px-8 py-2 md:py-4 border-b borderColor'>
                <h2 className='text-xl font-semibold'>{t("assignments")}</h2>
            </div>
            <div className='flex items-center gap-6 border-b borderColor px-4 md:px-8 py-2 md:py-4 overflow-x-auto pb-2'>
                {tabs.map((tab, index) => (
                    <div key={index} className={`text-sm md:text-base cursor-pointer ${activeTab === tab.title ? 'font-semibold primaryColor border-b-2 borderPrimary' : ''}`} onClick={() => setActiveTab(tab.title)}>
                        {tab.title}
                    </div>
                ))}
            </div>

            <div className='px-4 md:px-8 py-2 md:py-4'>
                {isLoading ? <AssignmentSkeleton /> : activeTab === 'Current Chapter Assignment' && <CurrentAssignment currentChapterAssignment={assignmentsData?.current_chapter_assignments} onAssignmentSubmitted={fetchAssignments} />}
                {isLoading ? <AssignmentSkeleton /> : activeTab === 'All Assignment' && <AllAssignment chapters={assignmentsData?.chapters} onAssignmentSubmitted={fetchAssignments} />}
            </div>
        </div>
    )
}

export default AssignmentTabContent
