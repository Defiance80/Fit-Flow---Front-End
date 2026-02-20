'use client'
import React, { useState, useEffect } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { useDispatch, useSelector } from 'react-redux';
import {
    notificationDataSelector,
    notificationLimitSelector,
    notificationPageSelector,
    notificationLoadMoreSelector,
    setNotificationData,
    setTotalNotifications,
    totalNotificationsSelector,
    resetNotificationState
} from '@/redux/reducers/nottificationSlice';
import { getNotification, Notification } from '@/utils/api/user/notification/getNotification';
import { extractErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';
import { isLoginSelector } from '@/redux/reducers/userSlice';
import DataNotFound from '../commonComp/DataNotFound';
import Link from 'next/link';
import { currentLanguageSelector } from '@/redux/reducers/languageSlice';

const NotificationDropdown = ({ isMobileNav }: { isMobileNav?: boolean }) => {

    const { t } = useTranslation();

    const isLogin = useSelector(isLoginSelector)
    const currentLanguageCode = useSelector(currentLanguageSelector)
    // Redux state management
    const dispatch = useDispatch();
    const notificationsData = useSelector(notificationDataSelector) as Notification[]
    const notificationLimit = useSelector(notificationLimitSelector) as number
    const totalNotificationsCount = useSelector(totalNotificationsSelector) as number
    const page = useSelector(notificationPageSelector) as number
    const isLoadMoreNotifications = useSelector(notificationLoadMoreSelector) as boolean

    const [isClient, setIsClient] = useState(false)
    const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false)
    const router = useRouter()
    const pathname = usePathname();
    const { slug } = useParams<{ slug: string }>();

    useEffect(() => {
        setIsClient(true)
    }, [])
    // Fetch notifications data function - follows same pattern as fetchCategoriesData
    const fetchNotificationsData = async () => {
        try {
            const response = await getNotification({
                per_page: notificationLimit,
                page: page,
            });

            if (response) {
                // Check if API returned an error (error: true in response)
                if (!response.error) {
                    if (response.data?.data) {
                        const extractedNotifications = response.data.data;

                        // Update total notifications count
                        dispatch(setTotalNotifications(response.data.unread_count))

                        if (extractedNotifications) {
                            if (!isLoadMoreNotifications) {
                                dispatch(setNotificationData(extractedNotifications))
                            } else {
                                // Load more - append data
                                dispatch(setNotificationData([...notificationsData, ...extractedNotifications]))
                            }
                        }
                    } else {
                        console.log('No notifications data found in response');
                        dispatch(setNotificationData([]));
                    }
                } else {
                    console.log("API error:", response.message);
                    toast.error(response.message || "Failed to fetch notifications");
                    dispatch(setNotificationData([]));
                }
            } else {
                console.log("response is null in component", response);
                dispatch(setNotificationData([]));
            }
        } catch (error) {
            dispatch(setNotificationData([]))
            extractErrorMessage(error);
        }
    }

    // useEffect for fetch notificatiosn data
    useEffect(() => {
        if (isLogin) {
            fetchNotificationsData();
        }
    }, [page, isLogin])

    useEffect(() => {
        dispatch(resetNotificationState());
    }, [isNotificationOpen])

    const handleViewAllNotifications = () => {
        if (pathname.includes('instructor')) {
            router.push(`/instructor/notifications?lang=${currentLanguageCode}`);
        } else if (pathname.includes('my-teams')) {
            router.push(`/my-teams/${slug}/notifications?lang=${currentLanguageCode}`);
        } else {
            router.push(`/notifications?lang=${currentLanguageCode}`);
        }
    }


    const notificationRedirection = (notification: Notification) => {
        if (notification.notification_type === 'course') {
            return `/course-details/${notification.slug}?lang=${currentLanguageCode}`;
        } else if (notification.notification_type === 'instructor') {
            return `/instructors/${notification.slug}?lang=${currentLanguageCode}`;
        } else if (notification.notification_type === 'url') {
            return notification.type_link;
        } else {
            return `/?lang=${currentLanguageCode}`;
        }
    }

    return (
        isClient &&
        <div
            className="relative h-full"
            onMouseLeave={() => { setIsNotificationOpen(false) }}
        >
            <DropdownMenu
                open={isNotificationOpen}
                onOpenChange={setIsNotificationOpen}
            >
                <DropdownMenuTrigger asChild>
                    <div
                        className="col-span- w-max md:border md:borderColor md:bg-[#F8F8F9] flexCenter justify-start p-3 rounded-[4px] h-full cursor-pointer hover:primaryBg hover:text-white transition-all duration-300"
                        onClick={() => {
                            setIsNotificationOpen(true);
                        }}
                    >
                        {isLogin && totalNotificationsCount > 0 && (
                            <span className="primaryBg text-white rounded-full absolute -right-2 -top-3 w-[24px] h-[24px] flexCenter text-sm border border-white">
                                {totalNotificationsCount}
                            </span>
                        )}
                        <Bell size={24} />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-[250px] sm:w-[350px] max-h-[500px] overflow-y-auto customScrollbar sm:max-h-[650px] -mt-1 border-none shadow-lg notificationDropdown"
                    align={isMobileNav ? 'start' : 'end'}
                    onMouseLeave={() => setIsNotificationOpen(false)}
                >
                    <div className="flex flex-col bg-white p-4 shadow-[0px_7px_28px_2px_#ADB3B83D] rounded-md gap-2 md:gap-4" onMouseLeave={() => {
                        setIsNotificationOpen(false);
                    }}>
                        {isLogin && notificationsData && notificationsData.length > 0 ? (
                            notificationsData.slice(0, 4).map((notification) => (
                                <div
                                    key={notification.id}
                                    className="border-b borderColor cursor-pointer last-of-type:border-b-0"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            {notification.image ? (
                                                <img
                                                    src={notification.image}
                                                    alt={notification.title}
                                                    className="w-12 h-12 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-300 rounded"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <Link
                                                href={notificationRedirection(notification) || ''}
                                                target={notification.notification_type === 'url' ? '_blank' : '_self'}
                                                rel={notification.notification_type === 'url' ? 'noopener noreferrer' : ''}
                                                className="font-medium text-sm md:text-xl">
                                                {notification.title}
                                            </Link>
                                            <p className="text-gray-500 text-sm mt-1 md:text-base">
                                                {notification.message}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-2 text-right md:text-sm">
                                                {notification.time_ago}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-4 text-center text-gray-500">
                                <DataNotFound />
                            </div>
                        )}

                        {isLogin && totalNotificationsCount > 4 && (
                            <button
                                className="commonBtn"
                                onClick={() => { handleViewAllNotifications() }}
                            >
                                {t("view_all")}
                            </button>
                        )}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default NotificationDropdown
