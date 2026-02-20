"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/community/PageHeader";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import { checkGroupApproval, CheckGroupApprovalData } from "@/utils/api/user/helpdesk/private-group-request/checkGroupApproval";
import { useSelector } from "react-redux";
import PrivateGroup from "./PrivateGroup";
import GroupAllQuestion from "./GroupAllQuestion";
import SupportGroupSkeleton from "@/components/skeletons/help-support/SupportGroupSkeleton";
import { extractErrorMessage, formatedSlug } from "@/utils/helpers";
import { currentLanguageSelector } from "@/redux/reducers/languageSlice";
import { toast } from "react-hot-toast";

const SupportGroup: React.FC<{ groupSlug: string }> = ({ groupSlug }) => {

  const currentLanguageCode = useSelector(currentLanguageSelector)
  // State for the check-group-approval api
  const [checkGroupApprovalData, setCheckGroupApprovalData] = useState<CheckGroupApprovalData | null>(null);
  const [loadingCheckGroupApproval, setLoadingCheckGroupApproval] = useState(false);

  const group = checkGroupApprovalData?.group;
  const isPrivate = group?.is_private === 1;
  const isApproved = checkGroupApprovalData?.is_approved;

  // Fetch check-group-approval api data with proper error handling
  const fetchCheckGroupApproval = async () => {
    try {
      setLoadingCheckGroupApproval(true);
      const response = await checkGroupApproval({ group_slug: groupSlug });
      if (response) {
        if (!response.error) {
          if (response.data?.data && response.data?.data.group) {
            setCheckGroupApprovalData(response.data.data);
          } else {
            toast.error(response.message);
            setCheckGroupApprovalData(null);
          }
        } else {
          toast.error(response.message);
          setCheckGroupApprovalData(null);
        }
      } else {
        setCheckGroupApprovalData(null);
      }
    } catch (error) {
      extractErrorMessage(error);
      setCheckGroupApprovalData(null);
    } finally {
      setLoadingCheckGroupApproval(false);
    }
  }

  // Call API when component mounts or group slug changes
  useEffect(() => {
    if (groupSlug) {
      fetchCheckGroupApproval();
    }
  }, [groupSlug]);


  return (
    <Layout>
      <PageHeader
        title={formatedSlug(groupSlug)}
        description="Discuss course creation, content delivery methods, and best practices for engaging learners."
        breadcrumbs={[
          { label: "Home", href: `/?lang=${currentLanguageCode}` },
          { label: "Help & Support", href: `/help-support?lang=${currentLanguageCode}` },
          { label: formatedSlug(groupSlug) },
        ]}
      />

      <div className="sectionBg">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-0">
            {/* Sidebar Component */}
            <CommunitySidebar currentSlug={groupSlug} />
            {loadingCheckGroupApproval ? (
              <div className="flex-grow">
                <SupportGroupSkeleton />
              </div>
            ) : (
              <>
                {isPrivate && !isApproved ? (
                  <PrivateGroup groupSlug={groupSlug} userRequestStatus={checkGroupApprovalData?.user_request_status || ""} />
                ) : (
                  <GroupAllQuestion groupSlug={groupSlug} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SupportGroup;
