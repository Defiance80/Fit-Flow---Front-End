"use client";
import React, { useEffect, useState } from "react";
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
// Import the RegisterModal and SignInWithPhoneModal components
import RegisterModal from "./RegisterModal";
import SignInWithPhoneModal from "../phone/SignInWithPhoneModal";
import SignInWithEmailModal from "./SignInWithEmailModal";
import AuthContinueWithBtn from "@/components/commonComp/AuthContinueWithBtn";
import { userExists } from '@/utils/api/auth/userExists/userExistsApi';
import {
  isUserExistsResponseSuccess,
  extractUserExistsData,
  extractErrorMessage
} from '@/utils/api/auth/userExists/userExistsHelpers';
import toast from 'react-hot-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useDispatch } from "react-redux";
import { setIsLoginModalOpen } from "@/redux/reducers/helpersReducer";


// Define the form schema using Zod
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

interface SignInModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onOpenChange }) => {

  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Add state for the RegisterModal visibility
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  // Add state for the Phone Modal visibility
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle toggling between sign-in and register modals
  const handleSignInClick = () => {
    setIsRegisterModalOpen(false);
    // onOpenChange(true);
    setIsSignInOpen(true);
  };

  // Handle going back to edit email
  const handleEmailChange = () => {
    setIsRegisterModalOpen(false);
    onOpenChange(true);
  };

  // Handle opening phone modal
  const handlePhoneClick = () => {
    setIsPhoneModalOpen(true);
    setIsSignInOpen(false);
    onOpenChange(false);
  };

  // Handle opening phone modal
  const handleEmailClick = () => {
    setIsSignInOpen(true);
    onOpenChange(false);
    setIsPhoneModalOpen(false);
  };

  const handleUserExists = async () => {
    try {
      // Get email from form
      const email = form.getValues().email;

      // Prepare exists check data
      const existsData = {
        email: email,
      };

      // Call the new userExists API
      const response = await userExists(existsData);

      // Handle successful response
      if (isUserExistsResponseSuccess(response)) {
        const existsData = extractUserExistsData(response);

        if (existsData) {
          if (existsData.is_new_user) {
            // User is new - show register modal
            setIsRegisterModalOpen(true);
            onOpenChange(false);
          } else {
            // User exists - show sign in modal
            setIsSignInOpen(true);
            onOpenChange(false);
          }
        }
      } else {
        // Handle error response
        const errorMessage = extractErrorMessage(response);
        console.error('User Exists API Error:', {
          error: response.error,
          message: response.message,
          code: response.code
        });
        // Show error message to user
        toast.error(errorMessage);
      }

    } catch (error) {
      console.error('Unexpected Error:', error);
      toast.error(t("unexpected_error_checking_user"));

      // Default to sign in modal on error
      setIsSignInOpen(true);
      onOpenChange(false);
    }
  }

  const handleResetMainModal = () => {
    form.reset();
  }

  useEffect(() => {
    if (!isOpen) {
      dispatch(setIsLoginModalOpen(false));
    }
  }, [isOpen]);


  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[450px] p-0 bg-white rounded-lg shadow-xl">
          <DialogHeader className="px-3 py-4 sm:p-6 !pb-0 gap-1">
            <DialogTitle className="text-start text-xl font-semibold text-gray-900">
              {t("sign_in_or_create_account")}
            </DialogTitle>
            <DialogDescription className="text-start text-sm text-gray-500">
              {t("enter_email_sign_in_create")}
            </DialogDescription>
          </DialogHeader>

          {/* divider */}
          <hr className="my-0 py-0 h-1 border-gray-300" />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUserExists)}
              className="space-y-5 px-3 sm:px-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                      {t("email")} <span className="text-red-500 ml-[-5px]">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("enter_your_email")}
                        {...field}
                        className="w-full px-4 py-2.5 h-12 border border-gray-300 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full primaryBg text-white font-normal py-2.5 h-12 rounded-md hover:hoverBgColor transition-all duration-300 md:text-xl"
              >
                {t("continue")}
              </Button>
            </form>
          </Form>

          <AuthContinueWithBtn onOpenChange={onOpenChange} handlePhoneClick={handlePhoneClick} handleEmailClick={handleEmailClick} />

        </DialogContent>
      </Dialog>

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onOpenChange={setIsRegisterModalOpen}
        email={form.getValues().email}
        onSignInClick={handleSignInClick}
        onEmailChange={handleEmailChange}
        handlePhoneClick={handlePhoneClick}
      />

      {/* Phone Sign In Modal */}
      <SignInWithPhoneModal
        isOpen={isPhoneModalOpen}
        onOpenChange={setIsPhoneModalOpen}
        handlePhoneClick={handlePhoneClick}
        handleEmailClick={handleEmailClick}
      />
      {/* Sign In with Email Modal */}
      <SignInWithEmailModal
        isOpen={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        email={form.getValues().email}
        handlePhoneClick={handlePhoneClick}
        handleResetMainModal={handleResetMainModal}
      />
    </>
  );
};

export default SignInModal;
