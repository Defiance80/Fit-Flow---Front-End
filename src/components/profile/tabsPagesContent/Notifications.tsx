"use client";
import Layout from "@/components/layout/Layout";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useTranslation } from '@/hooks/useTranslation';
import { useDispatch, useSelector } from "react-redux";
import {
  notificationDataSelector,
  totalNotificationsSelector,
  notificationLimitSelector,
  notificationLoadMoreSelector,
  setTotalNotifications,
} from "@/redux/reducers/nottificationSlice";
import { isLoginSelector } from "@/redux/reducers/userSlice";
import DataNotFound from "@/components/commonComp/DataNotFound";
import CustomImageTag from "@/components/commonComp/customImage/CustomImageTag";
import { setNotificationOffset } from "@/utils/helpers";
import TeamInvitationModal from "@/components/modals/TeamInvitationModal";
import { Notification } from "@/utils/api/user/notification/getNotification";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { markAllNotificationsAsRead } from "@/utils/api/user/notification/notificationMarkRead";
import { MarkAllNotificationsAsRead } from "@/utils/api/user/notification/notificationMarkAllRead";

// Note: Using Notification interface from the API instead of local interface
// The notification data is now managed through Redux state

export default function Notifications() {
  const { t } = useTranslation();
  const isLogin = useSelector(isLoginSelector);
  const notificationsData = useSelector(notificationDataSelector) as Notification[];
  const totalNotifications = useSelector(totalNotificationsSelector) as number;
  const notificationLimit = useSelector(notificationLimitSelector) as number;
  const isLoadMoreNotifications = useSelector(notificationLoadMoreSelector);
  const dispatch = useDispatch();

  const notificationRedirection = (notification: Notification) => {
    if (notification.notification_type === 'course') {
      return `/course-details/${notification.slug}`;
    } else if (notification.notification_type === 'instructor') {
      return `/instructors/${notification.slug}`;
    } else if (notification.notification_type === 'url') {
      return notification.type_link;
    } else {
      return '/';
    }
  }


  const allNotificationIds = notificationsData.map((notification) => notification.id);

  const handleMarkAllAsRead = async () => {

    if (allNotificationIds.length === 0) {
      toast.error("No notifications to mark as read");
      return;
    }

    try {
      const response = await markAllNotificationsAsRead(
        allNotificationIds
      );

      // Handle null response (network error)
      if (!response) {
        toast.error("Network error. Please try again.");
        return;
      }

      // Check if API returned an error
      if (response.error) {
        const errorMessage = response.message || "Failed to mark notifications as read";
        toast.error(errorMessage);
      } else {
        // Success case - silently mark as read
        // toast.success(response.message || "All notifications marked as read!");
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      toast.error("Something went wrong while marking notifications as read.");
    }
  };


  const handleMarkAllReadCompleted = async () => {

    if (allNotificationIds.length === 0) {
      toast.error("No notifications to mark as read");
      return;
    }

    try {
      const response = await MarkAllNotificationsAsRead();

      // Handle null response (network error)
      if (!response) {
        toast.error("Network error. Please try again.");
        return;
      }

      // Check if API returned an error
      if (response.error) {
        const errorMessage = response.message || "Failed to mark notifications as read";
        toast.error(errorMessage);
      } else {
        // Success case - silently mark as read
        // toast.success(response.message || "All notifications marked as read!");
        dispatch(setTotalNotifications(0));
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      toast.error("Something went wrong while marking notifications as read.");
    }
  };


  useEffect(() => {
    if (allNotificationIds.length > 0) {
      handleMarkAllAsRead();
    }
  }, []);

  return (
    <Layout>
      <div className="sectionBg py-8 md:py-12 border-b border-gray-200">
        <div className="container space-y-4">
          <div className="flexColCenter items-start gap-2">
            <h1 className="font-semibold text-2xl sm:text-3xl md:text-3xl lg:text-[40px]">
              {t("notifications")}
            </h1>
          </div>
          <div className="bg-white rounded-full py-2 px-4 w-max flexCenter gap-1">
            <Link href={"/"} className="primaryColor" title={t("home")}>
              {t("home")}
            </Link>
            <span>
              <MdKeyboardArrowRight size={22} />
            </span>
            <span>{t("my_profile")}</span>
            <span>
              <MdKeyboardArrowRight size={22} />
            </span>
            <span>{t("notifications")}</span>
          </div>
        </div>
      </div>

      <div className="sectionBg">
        <div className="container py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <ProfileSidebar />

            <div className="bg-white flex-1 w-full rounded-[10px]">
              <div className="flex justify-between items-center border-b border-gray-200 mb-0 border">
                <h2 className="text-lg font-semibold text-gray-800 py-4 px-6 ">
                  {t("notifications")}
                </h2>

                {notificationsData.length > 0 && (
                  <button onClick={handleMarkAllReadCompleted} className="mr-8 primaryBg font-medium text-white px-2 py-1 rounded-[8px]">{t("mark_as_all_read")}</button>
                )}
              </div>
              {/* Notification list container */}
              {/* We now map over the notificationsData array to render each notification item */}
              <div className="p-4 md:p-6 space-y-4">
                {/* Check if there are notifications to display */}
                {notificationsData && notificationsData.length > 0 ? (
                  notificationsData.map((notification) => (
                    <div
                      key={notification.id}
                      className="sectionBg p-4 rounded-[10px] flex gap-3 md:gap-4"
                    >
                      {/* Notification icon */}
                      <div className="w-16 h-16 bg-gray-300 rounded-md flex-shrink-0 m-auto">
                        <CustomImageTag
                          src={notification.image}
                          alt={notification.title}
                          className="w-16 h-16 rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
                          <Link
                            href={notificationRedirection(notification) || ''}
                            className="font-semibold text-gray-900 mb-1 md:mb-0 max-575:line-clamp-1" style={{ lineBreak: 'anywhere' }}>
                            {notification.title}
                          </Link>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {notification.time_ago}
                            </span>
                            {
                              notification.notification_type === 'team_invitation' &&
                              <TeamInvitationModal notification={notification} invitationToken={notification.team_members?.invitation_token as string} />
                            }
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 max-575:line-clamp-2" style={{ lineBreak: 'anywhere' }}>
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  // Display a message if there are no notifications
                  <div className="text-center text-gray-500">
                    <DataNotFound />
                  </div>
                )}
              </div>
              {/* Load More Button */}
              {/* Conditionally render the Load More button only if user is logged in and there are more notifications to load */}
              {isLogin && totalNotifications > notificationLimit && totalNotifications !== notificationsData?.length && (
                <div className="text-center pb-6">
                  <button
                    className="commonBtn w-full md:w-max"
                    onClick={async () => {
                      setNotificationOffset(1); // Load more notifications
                      // Wait a bit for the Redux state to update, then call the API
                      setTimeout(() => {
                        if (allNotificationIds.length > 0) {
                          handleMarkAllAsRead();
                        }
                      }, 500);
                    }}
                    disabled={isLoadMoreNotifications}
                  >
                    {isLoadMoreNotifications ? t("loading") : t("load_more")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
