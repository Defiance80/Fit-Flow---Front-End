"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "@/components/layout/Layout";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import DeleteAccountModal from "@/components/profile/DeleteAccountModal";
import { firebaseTokenSelector, logoutSuccess, userDataSelector } from "@/redux/reducers/userSlice";
import { deleteAccount } from "@/utils/api/user/editProfile/deleteAcc";
import toast from "react-hot-toast";
import { extractErrorMessage } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { deleteUser, getAuth, signOut, User } from "firebase/auth";
import { useTranslation } from "@/hooks/useTranslation";
import { UserDetails } from "@/utils/api/user/getUserDetails";
import { resetTeamMemberData } from "@/redux/instructorReducers/teamMemberSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function DeleteAccountPage() {

  const userData = useSelector(userDataSelector) as UserDetails;
  const isGoogleLogin = userData?.type === 'google';
  const firebaseToken = useSelector(firebaseTokenSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const auth = getAuth()

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const handleSignOut = async () => {
    try {
      await new Promise((resolve, reject) => {
        signOut(auth)
          .then(() => {
            dispatch(logoutSuccess())
            dispatch(resetTeamMemberData())
            if (typeof window !== 'undefined') {
              window.recaptchaVerifier = null
            }
            resolve(void 0) // Resolve the promise when signOut is successful
          })
          .catch(error => {
            toast.error(error)
            reject(error) // Reject the promise if there's an error
          })
      })
    } catch (error) {
      console.log('Oops errors!', error)
    }
  }

  // delete user account from  the firebse auth

  const deleteUserAccountFromFirebase = async () => {
    const user = auth.currentUser as User;
    if (!user) {
      console.log('User not found')
      return;
    }
    try {
      await deleteUser(user);
      console.log("Firebase account deleted");

    } catch (error) {
      console.log("Firebase delete error:", error);
    }
  };


  const handleDeleteAccount = async () => {
    try {
      // Set deleting state to show loading indicator
      setIsDeleting(true);

      // Validate password and agreement before proceeding
      if (!isGoogleLogin && !password) {
        toast.error("Please enter your password");
        setIsDeleting(false);
        return;
      }

      if (!isAgreed) {
        toast.error("Please confirm that you agree to delete your account");
        setIsDeleting(false);
        return;
      }

      // Call the delete account API
      const response = await deleteAccount({
        password: password,
        confirm_deletion: "1",
        firebase_token: firebaseToken,
      });

      if (response) {
        // Check if API returned an error (error: true in response)
        if (response.error) {
          console.log("API error:", response.message);
          toast.error(response.message || "Failed to delete account");
        } else {
          // Account deletion successful
          toast.success(response.message || "Account deleted successfully");
          deleteUserAccountFromFirebase();
          handleSignOut()
          setIsModalOpen(false);
          router.push("/");
        }
      } else {
        console.log("response is null in component", response);
      }
    } catch (error) {
      extractErrorMessage(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmDelete = () => {
    // Call handleDeleteAccount when user confirms deletion in modal
    handleDeleteAccount();
  };

  const openDeleteModal = () => {
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <div className="sectionBg py-8 md:py-12 border-b border-gray-200">
        <div className="container space-y-4">
          <div className="flexColCenter items-start gap-2">
            <h1 className="font-semibold text-2xl sm:text-3xl md:text-3xl lg:text-[40px]">
              {t("delete_account")}
            </h1>
          </div>
          <div className="bg-white rounded-full py-2 px-4 w-max flexCenter gap-1">
            <Link href={"/"} className="primaryColor" title="Home">
              {t("home")}
            </Link>
            <span>
              <MdKeyboardArrowRight size={22} />
            </span>
            <span>{t("my_profile")}</span>
            <span>
              <MdKeyboardArrowRight size={22} />
            </span>
            <span>{t("delete_account")}</span>
          </div>
        </div>
      </div>

      <div className="sectionBg">
        <div className="container py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <ProfileSidebar />

            <div className="bg-white flex-1 w-full rounded-[10px]">
              <h2 className="text-lg font-semibold text-gray-800 py-4 px-6 border-b border-gray-200 mb-0">
                {t("delete_account")}
              </h2>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {t("delete_account_permanently")}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {t("deleting_your_account_will_permanently_remove_all_your_enrolled_courses_and_created_content")}
                  </p>
                </div>
                {
                  !isGoogleLogin &&
                  <div className="space-y-2 relative">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t("password")}
                    </label>

                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("e_g_00000")}
                      className="sectionBg w-full rounded-[5px] px-4 py-2 border borderColor focus:outline-none"
                    />

                    <span
                      className="absolute right-3 top-[42px] cursor-pointer text-gray-500 sectionBg"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                }


                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="agreement"
                    name="agreement"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="h-4 w-4 text-primaryColor border-gray-300 rounded focus:primaryColor"
                  />
                  <label htmlFor="agreement" className="text-sm text-gray-700">
                    {t("agree_delete_account")}
                  </label>
                </div>

                <div>
                  <Button
                    type="button"
                    onClick={openDeleteModal}
                    disabled={(!isGoogleLogin && !password) || !isAgreed || isDeleting}
                    className="bg-red-600 text-white font-semibold px-6 py-2 rounded-[5px] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? t("deleting_account") : t("delete_account")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleConfirmDelete}
      />
    </Layout>
  );
}
