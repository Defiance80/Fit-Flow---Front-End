"use client";

import React, { useEffect, useState } from "react";
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
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./phone-input.css";
import SignInWithEmailModal from "../email/SignInWithEmailModal";
import ForgotPasswordWithPhoneModal from "./ForgotPasswordWithPhoneModal";
import AuthContinueWithBtn from "@/components/commonComp/AuthContinueWithBtn";
import { useDispatch, useSelector } from "react-redux";
import { settingsSelector } from "@/redux/reducers/settingsSlice";
import { setToken } from "@/redux/reducers/userSlice";
import toast from "react-hot-toast";
import { mobileLogin } from "@/utils/api/auth/mobile-login/mobileLogin";
import {
  isMobileLoginResponseSuccess,
  extractUserLoginData,
  extractErrorMessage,
  validateMobileLoginData
} from "@/utils/api/auth/mobile-login/mobileLoginHelpers";
import { useTranslation } from "@/hooks/useTranslation";



// Define the form schema using Zod
const formSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

interface SignUpWithPhoneNumberModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  phoneNumber: string;
  countryCode: string;
  handlePhoneClick: () => void;
  handleEmailClick: () => void;
  setPhoneNumber: (phoneNumber: string, countryCode: string) => void;
}

const SignUpWithPhoneNumberModal: React.FC<SignUpWithPhoneNumberModalProps> = ({
  isOpen,
  onOpenChange,
  phoneNumber,
  countryCode,
  handlePhoneClick,
  handleEmailClick,
  setPhoneNumber
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState<string>(phoneNumber);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [countryCodeStatus, setCountryCodeStatus] = useState(countryCode || 'in');

  const { t } = useTranslation();

  useEffect(()=>{
    setNewPhoneNumber(phoneNumber);
    setCountryCodeStatus(countryCode || 'in');
  },[phoneNumber, countryCode]);

  // console.log("newPhoneNumber =>", newPhoneNumber);

  const settingsData = useSelector(settingsSelector);
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const handleMobileLogin = async () => {
    try {
      // Prepare login data
      const loginData = {
        country_code: `+${countryCode}`,
        mobile: newPhoneNumber.replace(countryCode, ''),
        password: form.getValues().password,
        fcm_id: settingsData?.fcmtoken
      };

      // Validate login data before sending
      const validation = validateMobileLoginData(loginData);
      if (!validation.isValid) {
        toast.error(validation.errorMessage);
        console.log('countryCode =>', countryCode)
        return;
      }

      // Call the mobile login function
      const response = await mobileLogin(loginData);

      // Check if login was successful
      if (isMobileLoginResponseSuccess(response)) {
        const userData = extractUserLoginData(response);

        if (userData) {
          // Store token in Redux
          dispatch(setToken(userData.token || ''));

          // Show success message
          toast.success(response.message || 'Login successful');

          // Reset form and close modal
          setPhoneNumber('', '');
          form.reset();
          onOpenChange(false);
        } else {
          toast.error('Login successful but no user data received');
        }
      } else {
        // Handle login failure
        const errorMessage = extractErrorMessage(response);
        toast.error(errorMessage);
        console.error('Login error:', response);
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('Mobile login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    setNewPhoneNumber(value || "");
    console.log('newPhoneNumber =>', value)
  };

  const handleForgotPasswordClick = () => {
    setIsForgotPasswordOpen(true);
    onOpenChange(false);
  };

  return (
    <>

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[450px] p-0 bg-white rounded-lg shadow-xl">
          <DialogTitle className="sr-only">{t("sign_up_with_phone_number")}</DialogTitle>

          <div className="p-4 !pb-0 flex justify-between items-center">
            <div className="w-full">
              <h2 className="text-xl font-semibold text-gray-900">
                {t("sign_up_with_phone_number")}
              </h2>
              <p className="text-sm text-gray-500">
                {t("mobile_login_description")}
              </p>
            </div>
          </div>

          {/* divider */}
          <hr className="border-gray-200" />

          <div className="px-4 space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(() => handleMobileLogin())} className="space-y-4">
                {/* Phone number field (disabled, pre-filled) */}
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                    {t("phone_number")} <span className="text-red-500">*</span>
                  </FormLabel>

                  <div className="flex">
                    <PhoneInput
                      country={countryCodeStatus} // Default country
                      value={newPhoneNumber}
                      onChange={handlePhoneChange}
                      inputProps={{
                        name: "contactNumber",
                        id: "contactNumber",
                        required: true,
                        className: `w-full border border-gray-300 rounded-md phone-input-custom pl-12 focus:outline-transparent visible-outline`,
                      }}
                      placeholder="1234567890"
                    />
                  </div>
                </FormItem>

                {/* Password field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                        {t("password")} <span className="text-red-500">*</span>
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
                  {t("continue")}
                </Button>

              </form>
            </Form>
            <div className="flex justify-end mt-1">
              <button
                onClick={() => handleForgotPasswordClick()}
                className="text-sm primaryColor font-medium"
              >
                {t("forgot_password")}
              </button>
            </div>

            <AuthContinueWithBtn onOpenChange={onOpenChange} handlePhoneClick={handlePhoneClick} isMobileModal={true} handleEmailClick={handleEmailClick} />

          </div>
        </DialogContent>
      </Dialog>

      <SignInWithEmailModal
        isOpen={isEmailModalOpen}
        onOpenChange={setIsEmailModalOpen}
        handlePhoneClick={handlePhoneClick}
      />

      <ForgotPasswordWithPhoneModal
        isOpen={isForgotPasswordOpen}
        onOpenChange={setIsForgotPasswordOpen}
      />
    </>
  );
};

export default SignUpWithPhoneNumberModal;
