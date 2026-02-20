"use client"
import CustomImageTag from '@/components/commonComp/customImage/CustomImageTag';
import DataNotFound from '@/components/commonComp/DataNotFound';
import TableCellSkeleton from '@/components/skeletons/instrutor/TableCellSkeleton';
import { useTranslation } from '@/hooks/useTranslation';
import { NotificationItem } from '@/utils/api/instructor/notifications/getNotifications';
import { useRouter } from 'next/navigation';
import React from 'react'

interface NotificationsTableProps {
    notifications: NotificationItem[];
    isLoading?: boolean;
}

const NotificationsTable = ({ notifications, isLoading = false }: NotificationsTableProps) => {

    const { t } = useTranslation();
    const router = useRouter();

    const notificationRedirection = (notification: NotificationItem) => {
        if (notification.notification_type === 'course') {
            router.push(`/course-details/${notification.slug}`);
        } else if (notification.notification_type === 'instructor') {
            router.push(`/instructors/${notification.slug}`);
        } else if (notification.notification_type === 'url') {
            router.push(notification.type_link || '');
        } else {
            return null;
        }
    }

    return (
        <>
            <div className="title p-4 border-b borderColor">
                <h2 className="font-semibold">{t("notifications")}</h2>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block space-y-4">
                {
                    isLoading ? (
                        <div className='p-4'>
                            <TableCellSkeleton />
                        </div>
                    ) :
                        notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div key={notification.id} className={`flex gap-4 p-4 border-b borderColor last:border-b-0 m-0 ${notification.notification_type === 'url' || notification.notification_type === 'instructor' || notification.notification_type === 'course' ? 'cursor-pointer' : ''}`} onClick={() => notificationRedirection(notification)}>
                                    {/* Icon/Avatar placeholder */}
                                    <CustomImageTag src={''} alt={notification.title} className="w-12 h-12 rounded-md" />

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-semibold">{notification.title}</h3>

                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-500">
                                                    {notification.time_ago}
                                                </span>
                                                {/* {
                                                    notification.notification_type === 'team_invitation' &&
                                                    <TeamInvitationModal notification={notification} invitationToken={notification.team_members?.invitation_token as string} />
                                                } */}
                                            </div>

                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {notification.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) :
                            !isLoading &&
                            (
                                <DataNotFound />
                            )}
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {
                    isLoading ? (
                        <div className='p-4'>
                            <TableCellSkeleton />
                        </div>
                    ) :
                        notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div key={notification.id} className="flex gap-3 p-4 border-b borderColor last:border-b-0 justify-center items-center m-0">
                                    {/* Image Placeholder - Left Side */}
                                    <CustomImageTag src={''} alt={notification.title} className="w-12 h-12 rounded-md" />

                                    {/* Content - Right Side */}
                                    <div className="flex-1 min-w-0">
                                        {/* Time - Top */}
                                        <div className="text-gray-500 mb-1">
                                            {notification.time_ago}
                                        </div>

                                        {/* Title - Middle */}
                                        <h3 className="font-bold text-black mb-2 line-clamp-1">
                                            {notification.title}
                                        </h3>

                                        {/* Description - Bottom */}
                                        <p className="text-sm text-gray-600 line-clamp-2 leading-tight">
                                            {notification.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) :
                            !isLoading && (
                                <DataNotFound />
                            )}
            </div>
        </>
    )
}

export default NotificationsTable 