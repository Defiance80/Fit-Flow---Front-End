"use client";
import React, { useEffect, useState } from 'react'
import AllResources from './ResourceTabContentTabs/AllResources'
import CurrentLectureResource from './ResourceTabContentTabs/CurrentLectureResource'
import { Course } from '@/utils/api/user/getCourse';
import { useSelector } from 'react-redux';
import { getResources, ResourcesData } from '@/utils/api/user/getResources';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '@/utils/helpers';
import ResourceSkeleton from '@/components/skeletons/lesson-overview/ResourceSkeleton';
import { selectedCurriculumItemSelector } from '@/redux/reducers/helpersReducer';
import { useTranslation } from '@/hooks/useTranslation';

type Tab = {
    title: string;
}

interface ResourcesTabContentProps {
    courseData: Course;
}

const ResourcesTabContent: React.FC<ResourcesTabContentProps> = ({ courseData }) => {

    const { t } = useTranslation();
    const slug = courseData.slug;

    const selectedCurriculumItem = useSelector(selectedCurriculumItemSelector);
    const selectedCurriculumItemId = selectedCurriculumItem?.id;

    // State for resources data
    const [resourcesData, setResourcesData] = useState<ResourcesData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [activeTab, setActiveTab] = useState<string>('All Resources');

    const tabs: Tab[] = [
        {
            title: t("current_lecture_resources"),
        },
        {
            title: t("all_resources"),
        },
    ]

    // Function to fetch resources
    const fetchResources = async () => {
        setIsLoading(true);
        try {
            const response = await getResources({ slug, lecture_id: selectedCurriculumItemId as number });
            if (response) {
                if (!response.error) {
                    if (response.data) {
                        setResourcesData(response.data);
                    }
                    else {
                        setResourcesData(null);
                    }
                } else {
                    console.log("API error:", response.message);
                    toast.error(response.message || "Failed to fetch resources");
                    setResourcesData(null);
                }
            } else {
                console.log("response is null", response);
                setResourcesData(null);
            }
        } catch (error) {
            extractErrorMessage(error);
            setResourcesData(null);
        } finally {
            setIsLoading(false);
        }
    }

    // useEffect to fetch resources
    useEffect(() => {
        if (slug) {
            fetchResources();
        }
    }, [slug]);

    return (
        <div>
            <div className='px-4 md:px-8 py-2 md:py-4 border-b borderColor'>
                <h2 className='text-xl font-semibold'>{t("resources")}</h2>
            </div>
            <div className='flex items-center gap-6 border-b borderColor px-4 md:px-8 py-2 md:py-4 overflow-x-auto pb-2'>
                {tabs.map((tab, index) => (
                    <div key={index} className={`text-sm md:text-base cursor-pointer ${activeTab === tab.title ? 'font-semibold primaryColor border-b-2 borderPrimary' : ''}`} onClick={() => setActiveTab(tab.title)}>
                        {tab.title}
                    </div>
                ))}
            </div>

            <div className='px-4 md:px-8 py-2 md:py-4'>
                {isLoading ? <ResourceSkeleton /> : activeTab === 'All Resources' && <AllResources allResources={resourcesData?.all_resources} />}
                {isLoading ? <ResourceSkeleton /> : activeTab === 'Current Lecture Resources' && <CurrentLectureResource currentLectureResources={resourcesData?.current_lecture_resources} />}
            </div>
        </div>
    )
}

export default ResourcesTabContent
