"use client";

import React from "react";
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
import toast from "react-hot-toast";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { getAuthErrorMessage } from "@/utils/helpers";
import { useTranslation } from "@/hooks/useTranslation";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  email?: string;
  setSignInOpen: (isOpen: boolean) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onOpenChange,
  email = "",
  setSignInOpen
}) => {

  const { t } = useTranslation();

  // Define the form schema using Zod
  const formSchema = z.object({
    email: z.string().email({ message: t("invalid_email_address") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email || "",
    },
  });


  const onSubmit = async () => {
    const auth = getAuth()
    await sendPasswordResetEmail(auth, form.getValues().email)
      .then(() => {
        toast.success(t("password_reset_link_has_been_sent_to_your_mail"))
        // ...
        console.log("Email for password reset:", form.getValues().email);
        onOpenChange(false);
        setSignInOpen(true);
      })
      .catch(error => {
        console.log(error);
        const errorCode = error.code;
        const errorMessage = getAuthErrorMessage(errorCode);
        toast.error(errorMessage);
      })
    // Open OTP verification modal and close the current modal
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[350px] p-0 bg-white rounded-lg shadow-xl">
          <DialogTitle className="sr-only">{t("forgot_your_password")}</DialogTitle>

          <div className="px-4 pt-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t("forgot_your_password")}
            </h2>
            <p className="text-sm text-gray-500">
              {t("forgot_password_we_ll_help_you_reset_it")}
            </p>
          </div>

          {/* divider */}
          <hr className=" border-gray-200" />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-4 pb-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                      {t("email")} <span className="text-red-500 ml-[-4px]">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("enter_your_email")}
                        {...field}
                        className="w-full px-4 py-2.5 h-12 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full primaryBg text-white font-medium py-2.5 h-12 rounded-md "
              >
                {t("continue")}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ForgotPasswordModal;
