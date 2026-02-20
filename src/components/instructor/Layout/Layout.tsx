"use client";
import React, { useEffect } from "react";
import InstructorSidebar from "@/components/instructor/InstructorSidebar";
import DashboardHeader from "@/components/instructor/DashboardHeader";
import DashboardFooter from "@/components/instructor/DashboardFooter";
import { SidebarProvider } from "@/components/ui/sidebar";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { isNewMemberAddedSelector, setTeamMemberData, teamMemberDataSelector, teamMemberLimit, teamMemberPage, IsLoadMoreTeamMembers, updateTotalTeamMembers } from "@/redux/instructorReducers/teamMemberSlice";
import { userDataSelector } from "@/redux/reducers/userSlice";
import { extractErrorMessage } from "@/utils/helpers";
import { getTeamMembers, TeamMemberDataType } from "@/utils/api/instructor/team-member/getTeamMembers";
import { usePathname, useRouter } from "next/navigation";
import { UserDetails } from "@/utils/api/user/getUserDetails";
import { useTranslation } from "@/hooks/useTranslation";
import { settingsSelector } from "@/redux/reducers/settingsSlice";
import { currentLanguageSelector } from "@/redux/reducers/languageSlice";

export default function Layout({ children }: { children: React.ReactNode }) {

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const settings = useSelector(settingsSelector);
  const userData = useSelector(userDataSelector) as UserDetails;
  const isNewMemberAdded = useSelector(isNewMemberAddedSelector);
  const currentLangCode = useSelector(currentLanguageSelector);
  const router = useRouter();

  const pathname = usePathname();

  // Get pagination state from Redux
  const teamMemberLimitValue = useSelector(teamMemberLimit);
  const teamMemberPageValue = useSelector(teamMemberPage);
  const isLoadMoreTeamMembers = useSelector(IsLoadMoreTeamMembers);
  const teamMembersData = useSelector(teamMemberDataSelector) as TeamMemberDataType[];

  const fetchTeamMembers = async () => {
    try {
      // Use the new getTeamMembers utility function with pagination
      const response = await getTeamMembers({
        page: teamMemberPageValue,
        per_page: teamMemberLimitValue,
      });

      if (response) {
        // Check if API returned an error (error: true in response)
        if (!response.error) {
          // Handle successful response - extract team members data
          if (response.data?.data) {
            // Update total team members count
            dispatch(updateTotalTeamMembers({ data: response.data.total || 0 }));

            // Handle load more vs initial load
            if (!isLoadMoreTeamMembers) {
              // Initial load or refresh - replace data
              dispatch(setTeamMemberData(response.data.data));
            } else {
              // Load more - append data
              dispatch(setTeamMemberData([...teamMembersData, ...response.data.data]));
            }
          } else {
            console.log('No team members data found in response');
            dispatch(setTeamMemberData([]));
          }
        } else {
          // Handle API error case (like "No Team Members Found")
          if (response.message !== "No team members found") {
            console.log("API error in team members:", response.message);
            toast.error(response.message || "Failed to fetch team members");
            if (response.message === "Your instructor account has been suspended. Please contact support.") {
              router.push('/');
            }
          }
          dispatch(setTeamMemberData([]));
        }
      } else {
        console.log("response is null in component", response);
        dispatch(setTeamMemberData([]));
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      extractErrorMessage(error);
      dispatch(setTeamMemberData([]));
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [isNewMemberAdded, teamMemberPageValue]);

  useEffect(() => {
    if (settings) {
      document.documentElement.style.setProperty('--primary-color', settings?.data?.system_color || '#5a5bb5')
      // Set favicon from settings API
      if (settings?.data?.favicon) {
        const favicon: HTMLLinkElement = document.querySelector('link[rel="icon"]') as HTMLLinkElement || document.createElement("link") as HTMLLinkElement;
        favicon.rel = "icon";
        favicon.href = settings?.data?.favicon;
        if (!document.querySelector('link[rel="icon"]')) {
          document.head.appendChild(favicon);
        }
      }
    }
  }, [settings]);


  useEffect(() => {
    if ((!userData?.is_instructor && userData?.instructor_process_status === 'pending') || userData?.instructor_process_status !== 'approved') {
      router.push('/');
      toast.error(t('not_authorized'));
      return;
    }
    if (userData?.instructor_details?.type === 'team' && pathname.startsWith('my-teams')) {
      router.push('/instructor/dashboard');
      toast.error(t('not_authorized'));
    }
  }, [pathname])

  useEffect(() => {
    router.replace(`${pathname + `?lang=${currentLangCode}`}`)
  }, [pathname, currentLangCode]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        {/* Sidebar */}
        <InstructorSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <DashboardHeader />

          {/* Page Content */}
          <main className="flex-1 sectionBg px-4 md:px-6 py-4">{children}</main>

          {/* Footer */}
          <DashboardFooter />
        </div>
      </div>
    </SidebarProvider>
  );
}
