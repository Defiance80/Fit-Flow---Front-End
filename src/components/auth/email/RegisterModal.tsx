"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
// Import the VerifyEmailModal component
import VerifyEmailModal from "./VerifyEmailModal";
import toast from "react-hot-toast";
import { createUserWithEmailAndPassword, sendEmailVerification, getAuth } from "firebase/auth";
import { getAuthErrorMessage } from "@/utils/helpers";
import AuthContinueWithBtn from "@/components/commonComp/AuthContinueWithBtn";
import { setUserName } from "@/redux/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { FirebaseError } from "firebase/app";
import { useTranslation } from '@/hooks/useTranslation';
import { userSignup, UserSignupParams } from "@/utils/api/auth/user-signup/userSignupApi";
import { settingsSelector } from "@/redux/reducers/settingsSlice";


// Define the form schema using Zod
const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface RegisterModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  email: string;
  onSignInClick: () => void;
  onEmailChange: () => void;
  handlePhoneClick: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onOpenChange,
  email,
  onSignInClick,
  onEmailChange,
  handlePhoneClick
}) => {

  const settingsData = useSelector(settingsSelector);
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Add state for the VerifyEmailModal visibility
  const [isVerifyEmailModalOpen, setIsVerifyEmailModalOpen] = useState(false);

  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const auth = getAuth()

  const registerUser = async (userId: string, displayName: string, email: string, type: string, profile: string, idToken: string, password: string) => {
    try {
      // Prepare signup data
      const signupData: UserSignupParams = {
        name: displayName || form.getValues().name || '',
        email: email,
        fcm_id: settingsData?.fcmtoken,
        firebase_id: userId,
        firebase_token: idToken,
        type: type,
        password: password,
        confirm_password: password,
      };

      // Call the userSignup API
      const response = await userSignup(signupData);

      if (response) {
        // Check if API returned an error
        if (response.error) {
          console.log("API error:", response.message);
          toast.error(response.message || "Failed to register user");
        }
      } else {
        console.log("response is null in component", response);
        toast.error("Failed to register user. Please try again.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error(t("an_unexpected_error_occurred_during_registration"));
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // When form is submitted, open the email verification modal
    dispatch(setUserName(form.getValues().name))
    try {
      // Perform signup
      const userCredential = await createUserWithEmailAndPassword(auth, email, values.password)
      const user = userCredential.user
      const idToken = await user.getIdToken(); // 👈 fetch idToken
      // Send email verification
      sendEmailVerification(user)
      registerUser(user?.uid, user?.displayName || '', email, 'email', user?.photoURL || '', idToken, values?.password)
      setIsVerifyEmailModalOpen(true);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      handleError(error as FirebaseError)
    }
  }

  const handleError = (error: FirebaseError) => {
    console.log(error);
    const errorCode = error.code;
    const errorMessage = getAuthErrorMessage(errorCode);
    toast.error(errorMessage);
  }


  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[320px] sm:max-w-[450px] p-0 bg-white rounded-lg shadow-xl max-575:max-h-[90vh] overflow-y-auto">

          <DialogHeader className="px-3 py-4 sm:p-6 !pb-0 gap-1">
            <DialogTitle className="text-start text-xl font-semibold text-gray-900">
              {t("looks_like_youre_new_here")}
            </DialogTitle>
            <DialogDescription className="text-start text-sm text-gray-500">
              {t("fill_details_setup_account")}
            </DialogDescription>
          </DialogHeader>

          {/* divider */}
          <hr className=" border-gray-200" />

          {/* Email verification section */}
          <div className="px-3 sm:px-6">
            <p className="text-sm text-gray-500">
              {t("we_will_sent_verification_link")}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="font-medium text-gray-900">{email}</span>
              <button
                className="text-sm primaryColor font-medium"
                onClick={onEmailChange}
              >
                {t("change")}
              </button>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 px-3 sm:px-6"
            >
              {/* Name field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                      {t("name")} <span className="text-red-500 ml-[-5px]">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("wrteam_placeholder")}
                        {...field}
                        className="w-full px-4 py-2.5 h-12 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                      {t("password")} <span className="text-red-500 ml-[-5px]">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="w-full px-4 py-2.5 h-12 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Eye className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                      {t("confirm_password")}{" "}
                      <span className="text-red-500 ml-[-5px]">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="w-full px-4 py-2.5 h-12 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <Eye className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full primaryBg text-white font-normal py-2.5 h-12 rounded-md hover:hoverBgColor transition-all duration-300 md:text-xl"
              >
                {t("sign_up")}
              </Button>

              <div className="text-center">
                <span className="text-sm text-gray-500">
                  {t("already_have_account")}
                </span>{" "}
                <button
                  type="button"
                  className="text-sm primaryColor font-medium"
                  onClick={onSignInClick}
                >
                  {t("sign_in")}
                </button>
              </div>
            </form>
          </Form>

          <AuthContinueWithBtn onOpenChange={onOpenChange} handlePhoneClick={handlePhoneClick} />

        </DialogContent>
      </Dialog>

      {/* Email Verification Modal */}
      <VerifyEmailModal
        isOpen={isVerifyEmailModalOpen}
        onOpenChange={setIsVerifyEmailModalOpen}
        email={email}
        handlePhoneClick={handlePhoneClick}
      />
    </>
  );
};

export default RegisterModal;
