'use client'
import AssignmentSubmissionView from '@/components/instructor/assignments/AssignmentSubmissionView'
import DashboardBreadcrumb from '@/components/instructor/commonCommponents/instructorBreadcrumb/DashboardBreadcrumb';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import React from 'react'

const Page = () => {

    const { t } = useTranslation();
    const { assignmentSlug } = useParams<{ assignmentSlug: string }>();

    return (
        <div className="w-full">
            <DashboardBreadcrumb title={t("assignment_submission")} firstElement={t("assignments")} secondElement={t("assignment_submission")} />
            <AssignmentSubmissionView assignmentSlug={assignmentSlug} />
        </div>
    )
}

export default Page
