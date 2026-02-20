"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
import ForgotPasswordModal from "./ForgotPasswordModal";
import { getAuth, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { getAuthErrorMessage } from "@/utils/helpers";
import toast from "react-hot-toast";
import { userSignup, UserSignupParams } from '@/utils/api/auth/user-signup/userSignupApi';

import { useSelector, useDispatch } from "react-redux";
import { settingsSelector } from "@/redux/reducers/settingsSlice";
import { setFirebaseToken, setToken, userNameSelector } from "@/redux/reducers/userSlice";
import AuthContinueWithBtn from "@/components/commonComp/AuthContinueWithBtn";
import { useTranslation } from '@/hooks/useTranslation';


// Define the form schema using Zod
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Please enter valid password" }),
});

interface SignInWithEmailModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  email?: string;
  handlePhoneClick: () => void;
  handleResetMainModal?: () => void;
}

const SignInWithEmailModal: React.FC<SignInWithEmailModalProps> = ({
  isOpen,
  onOpenChange,
  email = "",
  handlePhoneClick,
  handleResetMainModal
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const dispatch = useDispatch();

  const settingsData = useSelector(settingsSelector);
  const userName = useSelector(userNameSelector);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (email && email !== form.getValues().email) {
      form.setValue("email", email);
    }
  }, [email, form]);

  const auth = getAuth()


  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsForgotPasswordOpen(true);
    onOpenChange(false);
  };

  // Function to register user using the simplified API method
  // This follows the same pattern as handleStartQuiz in StartQuiz.tsx
  const registerUser = async (userId: string, displayName: string, email: string, type: string, profile: string, idToken: string, password: string) => {
    try {
      // Prepare signup data
      const signupData: UserSignupParams = {
        name: displayName || userName || '',
        email: email,
        fcm_id: settingsData?.fcmtoken,
        firebase_id: userId,
        firebase_token: idToken,
        type: type,
        password: password,
        confirm_password: password,
        // Note: profile is a URL string from Firebase, not a File
        // The API will handle this appropriately
      };

      // Call the userSignup API
      const response = await userSignup(signupData);

      if (response) {
        // Check if API returned an error
        if (response.error) {
          console.log("API error:", response.message);
          toast.error(response.message || "Failed to register user");
        } else if (response.data) {
          // Success - user registered successfully
          // Show success message
          toast.success(response.message || 'Registration successful!');

          // Store authentication token from response data
          if (response.data.token) {
            dispatch(setToken(response.data.token));
          }

          // Reset form and close modal
          form.reset();
          handleResetMainModal?.();
          onOpenChange(false);
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
    // Handle sign in logic
    if (values.email && values.password) {
      await signInWithEmailAndPassword(auth, values.email, values.password)
        .then(async userCredential => {
          // Signed in
          const user = userCredential.user
          if (user?.emailVerified) {
            const idToken = await user.getIdToken(); // 👈 fetch idToken
            dispatch(setFirebaseToken(idToken || ''));
            registerUser(user?.uid, user?.displayName || '', values?.email, 'email', user?.photoURL || '', idToken, values?.password)
          } else {
            toast.error(t("please_verify_your_email_first"))
            sendEmailVerification(user)
          }
          onOpenChange(false)
        })
        .catch(function (error) {
          console.log(error);
          const errorCode = error.code;
          const errorMessage = getAuthErrorMessage(errorCode);
          toast.error(errorMessage);
        })
    }
  }


  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[450px] p-0 bg-white rounded-lg shadow-xl">
          {/* DialogTitle for accessibility */}
          <DialogTitle className="sr-only">{t("sign_in_with_email")}</DialogTitle>

          <div className="px-3 sm:px-6 pb-2 pt-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {t("sign_in_email_title")}
            </h2>
            <p className="text-sm text-gray-500">
              {t("enter_email_password")}
            </p>
          </div>
          {/* divider */}
          <hr className=" border-gray-200" />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-3 sm:px-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                      {t("email_label")} <span className="text-red-500 ml-[-4px]">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        className="w-full px-4 py-2.5 h-12 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                      {t("password_label")} <span className="text-red-500 ml-[-4px]">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••"
                          {...field}
                          className="w-full px-4 py-2.5 h-12 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
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
                {t("continue_button")}
              </Button>

              <div className="flex justify-end mt-1">
                <button
                  onClick={handleForgotPasswordClick}
                  className="text-sm primaryColor font-medium"
                >
                  {t("forgot_password")}
                </button>
              </div>
            </form>
          </Form>

          <AuthContinueWithBtn onOpenChange={onOpenChange} handlePhoneClick={handlePhoneClick} />


        </DialogContent>
      </Dialog>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onOpenChange={setIsForgotPasswordOpen}
        email={form.getValues().email}
        setSignInOpen={onOpenChange}
      />
    </>
  );
};

export default SignInWithEmailModal;
