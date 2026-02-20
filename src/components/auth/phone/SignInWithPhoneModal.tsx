"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import SignInWithEmailModal from "../email/SignInWithEmailModal";
import RegisterWithPhoneModal from "./RegisterWithPhoneModal";
import AuthContinueWithBtn from "@/components/commonComp/AuthContinueWithBtn";
import SignUpWithPhoneNumberModal from "./SignUpWithPhoneNumberModal";
import toast from 'react-hot-toast';
import { userExists } from "@/utils/api/auth/userExists/userExistsApi";
import { useTranslation } from "@/hooks/useTranslation";

interface SignInWithPhoneModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  handlePhoneClick: () => void;
  handleEmailClick: () => void;
}

const SignInWithPhoneModal: React.FC<SignInWithPhoneModalProps> = ({
  isOpen,
  onOpenChange,
  handlePhoneClick,
  handleEmailClick
}) => {
  const [phoneNumber, setPhoneNumber] = useState<{
    number: string;
    countryCode: string;
  }>({
    number: "",
    countryCode: "",
  });

  useEffect(() => {
    if (isOpen) {
      setPhoneNumber({
        number: "",
        countryCode: "",
      });
    }
  }, [isOpen]);

  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const mobileNumber = phoneNumber.number.replace(phoneNumber.countryCode, '');

  const { t } = useTranslation();

  const handleUserExists = async () => {
    try {
      // Build request (aligning with reference flow structure)
      const formData = new FormData();
      formData.append('mobile', mobileNumber);
      formData.append('country_code', phoneNumber.countryCode);

      const response = await userExists({
        mobile: mobileNumber,
        country_code: phoneNumber.countryCode,
      });

      const { data } = response;
      const isNewUser = data?.data?.is_new_user;

      if (isNewUser) {
        setIsRegisterModalOpen(true);
        onOpenChange(false);
      } else {
        setIsSignUpModalOpen(true);
        onOpenChange(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error checking user existence:', error);
      const apiMessage = error?.response?.data?.message;
      if (apiMessage) {
        console.error('API Error:', apiMessage);
        toast.error(apiMessage);
      } else {
        console.error('Network error or unknown error');
        toast.error('Unexpected error checking user.');
      }

      // Default to sign up modal on error (kept consistent with phone flow)
      setIsSignUpModalOpen(true);
      onOpenChange(false);
    }
  }

  const handlePhoneChange = () => {
    setIsRegisterModalOpen(false);
    onOpenChange(true);
  };

  const handlePhoneNumber = (value: string,
    country: { dialCode: string; name: string; countryCode: string }) => {
    setPhoneNumber({
      number: value || "",
      countryCode: country.dialCode || "",
    });
  }

  const handleSignInClick = () => {
    setIsRegisterModalOpen(false);
    onOpenChange(true);
  };

  // Create a wrapper function to match the expected signature
  const handleSetPhoneNumber = (phoneNumber: string, countryCode: string) => {
    setPhoneNumber({
      number: phoneNumber,
      countryCode: countryCode,
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[450px] p-0 bg-white rounded-lg shadow-xl">
          <DialogTitle className="sr-only">
            {t("sign_in_with_phone_number")}
          </DialogTitle>

          <div className="p-4 !pb-0 flex justify-between items-center">
            <div className="w-full">
              <h2 className="text-xl font-semibold text-gray-900">
                {t("sign_in_create_account")}
              </h2>
              <p className="text-sm text-gray-500">
                {t("enter_mobile_description")}
              </p>
            </div>
          </div>

          {/* divider */}
          <hr className="border-gray-200" />

          <div className="px-4">
            <div className="mb-4">
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                {t("phone_number")} <span className="text-red-500 ml-[-2px]">*</span>
              </label>
              <PhoneInput
                country={"in"} // Default country
                value={phoneNumber.number}
                onChange={handlePhoneNumber}
                inputProps={{
                  name: "contactNumber",
                  id: "contactNumber",
                  required: true,
                  className: `w-full border border-gray-300 rounded-md phone-input-custom pl-12`,
                }}
                placeholder="1234567890"
              />
            </div>

            <Button
              onClick={handleUserExists}
              className="w-full primaryBg text-white font-normal py-2.5 h-12 rounded-md hover:hoverBgColor transition-all duration-300 md:text-xl"
              disabled={!phoneNumber.number || phoneNumber.number.length < 8}
            >
              {t("continue")}
            </Button>
          </div>

          <AuthContinueWithBtn onOpenChange={onOpenChange} handlePhoneClick={handlePhoneClick} isMobileModal={true} handleEmailClick={handleEmailClick} />

        </DialogContent>
      </Dialog>

      <SignInWithEmailModal
        isOpen={isEmailModalOpen}
        onOpenChange={setIsEmailModalOpen}
        handlePhoneClick={handlePhoneClick}
      />

      {/* SignUpWithPhoneNumberModal */}
      <SignUpWithPhoneNumberModal
        isOpen={isSignUpModalOpen}
        onOpenChange={setIsSignUpModalOpen}
        phoneNumber={phoneNumber.number}
        countryCode={phoneNumber.countryCode}
        setPhoneNumber={handleSetPhoneNumber}
        handlePhoneClick={handlePhoneClick}
        handleEmailClick={handleEmailClick}
      />

      <RegisterWithPhoneModal
        isOpen={isRegisterModalOpen}
        onOpenChange={setIsRegisterModalOpen}
        phoneNumber={phoneNumber.number}
        countryCode={phoneNumber.countryCode}
        setPhoneNumber={handleSetPhoneNumber}
        onSignInClick={handleSignInClick}
        onPhoneChange={handlePhoneChange}
        handlePhoneClick={handlePhoneClick}
        handleEmailClick={handleEmailClick}
        handlePhoneChange={handlePhoneChange}
      />
    </>
  );
};

export default SignInWithPhoneModal;
