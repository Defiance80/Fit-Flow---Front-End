"use client";
import React, { useState } from 'react'
import OverviewTabContent from './OverviewTabContent';
import ResourcesTabContent from './ResourcesTabContent';
import DiscussionTabContent from './DiscussionTabContent';
import AssignmentTabContent from './assignment/AssignmentTabContent';
import ReviewSection from './review/ReviewSection';
import CertificateTabContent from './CertificateTabContent';
import { Course } from '@/utils/api/user/getCourse';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
interface Tab {
    title: string;
}

interface TabSectProps {
    courseData: Course;
}

const TabSect: React.FC<TabSectProps> = ({ courseData }) => {

    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');

    const [activeTab, setActiveTab] = useState<string>(tab || 'Overview');

    const tabs: Tab[] = [
        {
            title: t("overview"),
        },
        {
            title: t("resources"),
        },
        {
            title: t("discussion"),
        },
        {
            title: t("assignment"),
        },
        {
            title: t("reviews"),
        },
        {
            title: t("certificate"),
        },
    ]

    return (
        <div className=''>
            <div className='flex items-center gap-6 border-b borderColor px-4 md:px-8 overflow-x-auto pb-2 md:pb-0'>
                {tabs.map((tab, index) => (
                    <div key={index} className={`cursor-pointer ${activeTab === tab.title ? 'font-semibold primaryColor border-b-2 borderPrimary' : ''}`} onClick={() => setActiveTab(tab.title)}>
                        {tab.title}
                    </div>
                ))}
            </div>
            <div className=''>
                {activeTab === 'Overview' && <OverviewTabContent courseData={courseData} />}
                {activeTab === 'Resources' && <ResourcesTabContent courseData={courseData} />}
                {activeTab === 'Discussion' && <DiscussionTabContent courseId={courseData.id} />}
                {activeTab === 'Assignment' && <AssignmentTabContent courseId={courseData.id} />}
                {activeTab === 'Reviews' && <ReviewSection courseData={courseData} />}
                {activeTab === 'Certificate' && <CertificateTabContent courseData={courseData} />}
            </div>
        </div>
    )
}

export default TabSect
