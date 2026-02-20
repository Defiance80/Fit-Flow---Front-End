"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./phone-input.css";
import ForgotPasswordPhoneOTPModal from "./ForgotPasswordPhoneOTPModal";
import { useTranslation } from '@/hooks/useTranslation';


// Define the form schema using Zod
const formSchema = z.object({
  phoneNumber: z.string().min(10, { message: "Invalid phone number." }),
});

interface ForgotPasswordWithPhoneModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ForgotPasswordWithPhoneModal: React.FC<
  ForgotPasswordWithPhoneModalProps
> = ({ isOpen, onOpenChange }) => {
  const { t } = useTranslation();
  // const [value, setValue] = useState<string | undefined>("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const [phoneNumber, setPhoneNumber] = useState<{
    number: string;
    countryCode: string;
  }>({
    number: "",
    countryCode: "",
  });

  function onSubmit() {
    // Open OTP verification modal and close the current modal
    setIsOtpModalOpen(true);
    onOpenChange(false);
  }

  // Handle OTP modal state changes
  const handleOtpModalOpenChange = (open: boolean) => {
    setIsOtpModalOpen(open);
  };

  const handlePhoneNumber = (value: string,
    country: { dialCode: string; name: string; countryCode: string }) => {
    setPhoneNumber({
      number: value || "",
      countryCode: country.dialCode || "",
    });
    form.setValue("phoneNumber", value || "");
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[350px] p-0 bg-white rounded-lg shadow-xl">
          <DialogTitle className="sr-only">
            {t("forgot_password_with_mobile_number")}
          </DialogTitle>

          <div className="px-4 pt-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t("forgot_your_password")}
            </h2>
            <p className="text-sm text-gray-500">
              {t("forgot_password_we_ll_help_you_reset_it")}
            </p>
          </div>

          {/* divider */}
          <hr className="border-gray-200" />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-4 pb-4"
            >
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                      {t("phone_number")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        country={"in"} // Default country
                        value={phoneNumber.number || ""}
                        onChange={handlePhoneNumber}
                        inputProps={{
                          name: "contactNumber",
                          id: "contactNumber",
                          required: true,
                          className: `w-full border border-gray-300 rounded-md phone-input-custom pl-12`,
                        }}
                        placeholder={t("1234567890")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full primaryBg text-white font-normal py-2.5 h-12 rounded-md hover:hoverBgColor transition-all duration-300 md:text-xl"
                disabled={!phoneNumber.number || phoneNumber.number.length < 8}
              >
                {t("continue")}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Modal */}
      <ForgotPasswordPhoneOTPModal
        isOpen={isOtpModalOpen}
        onOpenChange={handleOtpModalOpenChange}
        phoneNumber={phoneNumber.number || ""}
        countryCode={phoneNumber.countryCode || ""}
        changePhoneNumber={onOpenChange}
      />
    </>
  );
};

export default ForgotPasswordWithPhoneModal;
