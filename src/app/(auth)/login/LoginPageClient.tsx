"use client";
import React, { useState } from "react";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
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
import AuthContinueWithBtn from "@/components/commonComp/AuthContinueWithBtn";
import RegisterModal from "@/components/auth/email/RegisterModal";
import SignInWithPhoneModal from "@/components/auth/phone/SignInWithPhoneModal";
import SignInWithEmailModal from "@/components/auth/email/SignInWithEmailModal";
import { userExists } from "@/utils/api/auth/userExists/userExistsApi";
import {
  isUserExistsResponseSuccess,
  extractUserExistsData,
  extractErrorMessage,
} from "@/utils/api/auth/userExists/userExistsHelpers";
import toast from "react-hot-toast";
import { useTranslation } from "@/hooks/useTranslation";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

export default function LoginPageClient() {
  const { t } = useTranslation();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const handlePhoneClick = () => {
    setIsPhoneModalOpen(true);
    setIsSignInOpen(false);
  };

  const handleEmailClick = () => {
    setIsSignInOpen(true);
    setIsPhoneModalOpen(false);
  };

  const handleUserExists = async () => {
    try {
      const email = form.getValues().email;
      const response = await userExists({ email });

      if (isUserExistsResponseSuccess(response)) {
        const existsData = extractUserExistsData(response);
        if (existsData) {
          if (existsData.is_new_user) {
            setIsRegisterModalOpen(true);
          } else {
            setIsSignInOpen(true);
          }
        }
      } else {
        toast.error(extractErrorMessage(response));
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      toast.error(t("unexpected_error_checking_user"));
      setIsSignInOpen(true);
    }
  };

  return (
    <AuthPageLayout>
      <div className="space-y-6">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-[#94A3B8] text-sm sm:text-base">
            Sign in to continue your fitness journey
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUserExists)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#94A3B8]">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      className="w-full px-4 py-3 h-12 bg-[#1E293B] border border-white/10 rounded-lg text-white placeholder:text-[#64748B] focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0D9488] to-[#0F766E] text-white font-semibold py-3 h-12 rounded-lg hover:opacity-90 transition-all duration-300 text-base"
            >
              Continue
            </Button>
          </form>
        </Form>

        <AuthContinueWithBtn
          onOpenChange={() => {}}
          handlePhoneClick={handlePhoneClick}
          handleEmailClick={handleEmailClick}
        />

        <p className="text-center text-[#64748B] text-xs mt-8">
          By continuing, you agree to Fit Flow&apos;s{" "}
          <a href="/terms-conditions" className="text-[#0D9488] hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy-policy" className="text-[#0D9488] hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>

      {/* Modals for subsequent auth steps */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onOpenChange={setIsRegisterModalOpen}
        email={form.getValues().email}
        onSignInClick={() => {
          setIsRegisterModalOpen(false);
          setIsSignInOpen(true);
        }}
        onEmailChange={() => setIsRegisterModalOpen(false)}
        handlePhoneClick={handlePhoneClick}
      />
      <SignInWithPhoneModal
        isOpen={isPhoneModalOpen}
        onOpenChange={setIsPhoneModalOpen}
        handlePhoneClick={handlePhoneClick}
        handleEmailClick={handleEmailClick}
      />
      <SignInWithEmailModal
        isOpen={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        email={form.getValues().email}
        handlePhoneClick={handlePhoneClick}
        handleResetMainModal={() => form.reset()}
      />
    </AuthPageLayout>
  );
}
