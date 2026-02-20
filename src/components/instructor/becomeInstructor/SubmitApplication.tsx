"use client";
import { Button } from "@/components/ui/button";
import { IoArrowBackOutline } from "react-icons/io5";
import Layout from "./Layout";
// import Layout from "@/components/layout/Layout";
import { userDataSelector } from "@/redux/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../courses/types";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { isInstructorFromResubmitSelector, setIsInstructorFromResubmit } from "@/redux/reducers/helpersReducer";
import pendingImg from "@/assets/images/becom-instructor/ApplicationReview.svg";
import rejectedImg from "@/assets/images/becom-instructor/ApplicationRejected.svg";
import CustomImageTag from "@/components/commonComp/customImage/CustomImageTag";

export default function SubmitApplication() {

  const userData = useSelector(userDataSelector) as User;
  const { t } = useTranslation();
  const isInstructorFromResubmit = useSelector(isInstructorFromResubmitSelector);
  const dispatch = useDispatch();

  const chnageIsInstructorFromResubmit = () => {
    dispatch(setIsInstructorFromResubmit(true));
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto h-screen container">
        {/* Placeholder for an icon or image */}
        <div className="w-full h-[254px] lg:w-[400px] lg:h-[400px] flex items-center justify-center mb-6">
          <CustomImageTag src={userData?.instructor_process_status === 'pending' || isInstructorFromResubmit ? pendingImg : userData?.instructor_process_status === 'rejected' || isInstructorFromResubmit ? rejectedImg : pendingImg} alt="pending-img" className="w-full h-full object-contain" />
        </div>

        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3">

          {
            `${t("your_application_is")} ${userData?.instructor_process_status === "pending" || isInstructorFromResubmit
              ? t("under_review")
              : userData?.instructor_process_status === "rejected" || isInstructorFromResubmit
                ? t("rejected")
                : userData?.instructor_process_status === "suspended" || isInstructorFromResubmit
                  ? t("suspended")
                  : ""
            }`


          }
        </h1>
        <p className="mb-6 text-sm leading-relaxed">
          {

            userData?.instructor_process_status === 'pending' || isInstructorFromResubmit
              ? t("thank_you_submitting_application")
              : userData?.instructor_process_status === 'rejected' || isInstructorFromResubmit
                ? t("your_application_rejected")
                : userData?.instructor_process_status === 'suspended' || isInstructorFromResubmit
                  ? t("your_account_suspended")
                  : ""

          }
        </p>
        <div className="flexCenter gap-6 flex-wrap">
          <Link href="/">
            <Button
              className={`${userData?.instructor_process_status === 'rejected' ? 'bg-transparent text-black border hover:bg-transparent' : 'bg-black text-white hover:bg-gray-800'} px-6 py-2 flex items-center gap-2 rounded-md transition-colors`}
            >
              <IoArrowBackOutline /> {t("go_to_back")}
            </Button>
          </Link>
          {
            (userData?.instructor_process_status === 'rejected' && !isInstructorFromResubmit) &&
            <Link href="/become-instructor/process">
              <Button
                className="bg-black text-white hover:bg-gray-800 px-6 py-2 flex items-center gap-2 rounded-md transition-colors"
                onClick={chnageIsInstructorFromResubmit}
              >
                {t("resubmit")}
              </Button>
            </Link>
          }
        </div>
      </div>
    </Layout>
  );
}
