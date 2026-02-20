"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/useTranslation";
import { Notification } from "@/utils/api/user/notification/getNotification";
import { useState } from "react";
import CustomImageTag from "../commonComp/customImage/CustomImageTag";
import { acceptInvitation } from "@/utils/api/user/team-invitation/acceptInvitation";
import { useSelector } from "react-redux";
import { userDataSelector } from "@/redux/reducers/userSlice";
import toast from "react-hot-toast";
import { extractErrorMessage } from "@/utils/helpers";
import { UserDetails } from "@/utils/api/user/getUserDetails";
import { useRouter } from "next/navigation";

interface TeamInvitationModalProps {
    notification: Notification;
    invitationToken: string;
}

const TeamInvitationModal = ({ notification, invitationToken }: TeamInvitationModalProps) => {

    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const userData = useSelector(userDataSelector) as UserDetails;
    const isInstructor = userData?.is_instructor;
    const instructorStatus = userData?.instructor_process_status;
    const instructorDetails = notification.instructor_details;
    const router = useRouter();

    // Handle invitation accept/reject function with proper error handling
    const handleInvitation = async (action: "accept" | "reject") => {
        if (instructorStatus === "pending") {
            toast.error(t("application_pending"));
            return;
        }
        if (!isInstructor) {
            toast.error(t("become_an_instructor_first"));
            router.push(`/become-instructor/process`);
            return;
        }
        try {
            if (!invitationToken) {
                toast.error("Invitation token not found");
                return;
            }

            // Call the accept invitation API
            const response = await acceptInvitation({
                action: action,
                invitation_token: invitationToken,
            });

            if (response) {
                // Check if API returned an error (error: true in response)
                if (response.error) {
                    console.log("API error:", response.message);
                    toast.error(response.message || `Failed to ${action} invitation`);
                } else {
                    // Show success message
                    const successMessage = action === "accept"
                        ? "Invitation accepted successfully"
                        : "Invitation rejected successfully";
                    toast.success(response.message || successMessage);
                    // Close the modal after successful action
                    setIsOpen(false);
                }
            } else {
                console.log("response is null in component", response);
            }
        } catch (error) {
            extractErrorMessage(error);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-4xl font-light">|</span>
                    <span className="bg-black text-white py-1 px-2 rounded-md text-sm">
                        {t("view_request")}
                    </span>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-[532px] rounded-2xl p-0 shadow-lg">
                <DialogHeader className="border-b border-gray-200 px-6 py-4">
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                        {t("invitation_request")}
                    </DialogTitle>
                    <DialogDescription className="hidden">
                        {t("invitation_details_for_joining_a_team")}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 space-y-6">
                    <div className="grid grid-cols-12 gap-4">
                        <div
                            className="col-span-2 rounded-md bg-gray-200 w-full h-[71px]"
                            aria-hidden="true"
                        >
                            <CustomImageTag
                                src={instructorDetails?.profile || ""}
                                alt={instructorDetails?.name || "Instructor"}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="col-span-10 space-y-2">
                            <p className="text-base font-semibold text-gray-900">
                                {instructorDetails?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                                {instructorDetails?.name} has invited you to join their team. Do you want to accept the request?
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-baseline w-full gap-4">
                        <button
                            type="button"
                            className="w-full primaryBg text-white py-2 px-3 rounded-md"
                            onClick={() => handleInvitation("accept")}
                        >
                            {t("accept")}
                        </button>
                        <button
                            type="button"
                            className="w-full border py-2 px-3 rounded-md"
                            onClick={() => handleInvitation("reject")}
                        >
                            {t("decline")}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TeamInvitationModal;
