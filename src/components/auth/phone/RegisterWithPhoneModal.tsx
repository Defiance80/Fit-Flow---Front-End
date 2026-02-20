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
import VerifyPhoneModal from "./VerifyPhoneModal";
import AuthContinueWithBtn from "@/components/commonComp/AuthContinueWithBtn";
import { useDispatch } from "react-redux";
import { setUserName } from "@/redux/reducers/userSlice";
import { useTranslation } from '@/hooks/useTranslation';


// Define the form schema using Zod
const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface RegisterWithPhoneModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  phoneNumber: string;
  countryCode: string;
  onSignInClick: () => void;
  onPhoneChange: () => void;
  handlePhoneClick: () => void;
  handleEmailClick: () => void;
  handlePhoneChange: () => void;
  setPhoneNumber: (phoneNumber: string, countryCode: string) => void;
}

const RegisterWithPhoneModal: React.FC<RegisterWithPhoneModalProps> = ({
  isOpen,
  onOpenChange,
  phoneNumber,
  countryCode,
  onSignInClick,
  onPhoneChange,
  handlePhoneClick,
  handleEmailClick,
  handlePhoneChange,
  setPhoneNumber
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Add state for the VerifyPhoneModal visibility
  const [isVerifyPhoneModalOpen, setIsVerifyPhoneModalOpen] = useState(false);

  const mobileNumber = phoneNumber.replace(countryCode, '');

  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // When form is submitted, open the phone verification modal
    console.log(values);
    dispatch(setUserName(values.name))
    setIsVerifyPhoneModalOpen(true);
    // Close the register modal
    onOpenChange(false);
  }

  const handleEmailClickRegister = () => {
    onOpenChange(false);
    handleEmailClick();
  }

  const { t } = useTranslation();

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
          <hr className="border-gray-200" />

          {/* Phone verification section */}
          <div className="px-3 sm:px-6">
            <p className="text-sm text-gray-500">
              {t("we_will_sent_verification_code")}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="font-medium text-gray-900">+{countryCode} {mobileNumber}</span>
              <button
                className="text-sm primaryColor font-medium"
                onClick={onPhoneChange}
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
                        placeholder="wrteam"
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

          <AuthContinueWithBtn onOpenChange={onOpenChange} handlePhoneClick={handlePhoneClick} isMobileModal={true} handleEmailClick={handleEmailClickRegister} />

        </DialogContent>
      </Dialog>

      {/* Phone Verification Modal */}
      <VerifyPhoneModal
        isOpen={isVerifyPhoneModalOpen}
        onOpenChange={setIsVerifyPhoneModalOpen}
        phoneNumber={mobileNumber}
        countryCode={countryCode}
        password={form.getValues().password}
        confirmPassword={form.getValues().confirmPassword}
        handlePhoneClick={handlePhoneClick}
        handleEmailClick={handleEmailClick}
        handlePhoneChange={handlePhoneChange}
        setPhoneNumber={setPhoneNumber}
      />
    </>
  );
};

export default RegisterWithPhoneModal;
