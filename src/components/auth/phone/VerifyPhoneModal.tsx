"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Import the SignUpWithPhoneNumberModal
import SignUpWithPhoneNumberModal from "./SignUpWithPhoneNumberModal";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import toast from "react-hot-toast";
import FirebaseData from "@/utils/Firebase";
import { useDispatch, useSelector } from "react-redux";
import { settingsSelector } from "@/redux/reducers/settingsSlice";
import { setToken, userNameSelector } from "@/redux/reducers/userSlice";
import { FirebaseError } from "firebase/app";
import { useTranslation } from '@/hooks/useTranslation';
import { getAuthErrorMessage } from "@/utils/helpers";
import { mobileRegistration, MobileRegistrationRequest } from "@/utils/api/auth/user-mobile-register/userMobileRegister";


interface VerifyPhoneModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  phoneNumber: string;
  countryCode: string;
  password: string;
  confirmPassword: string;
  handlePhoneClick: () => void;
  handleEmailClick: () => void;
  handlePhoneChange: () => void;
  setPhoneNumber: (phoneNumber: string, countryCode: string) => void;
}

const VerifyPhoneModal: React.FC<VerifyPhoneModalProps> = ({
  isOpen,
  onOpenChange,
  phoneNumber,
  countryCode,
  password,
  confirmPassword,
  handlePhoneClick,
  handleEmailClick,
  handlePhoneChange,
  setPhoneNumber
}) => {
  const { t } = useTranslation();
  // State for OTP inputs
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Add state for the SignUpWithPhoneNumberModal
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const settingsData = useSelector(settingsSelector);
  const userName = useSelector(userNameSelector);
  const dispatch = useDispatch();


  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(0, 1); // Take only the first character
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Check if pasted content is all numbers and has a valid length
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.substring(0, 6).split("");
    const newOtp = [...otp];

    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
        if (inputRefs.current[index]) {
          inputRefs.current[index]!.value = digit;
        }
      }
    });

    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextEmptyIndex = digits.length < 6 ? digits.length : 5;
    if (nextEmptyIndex < 6) {
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  };

  const handleVerify = () => {
    submitOTP({ preventDefault: () => { } } as React.FormEvent<HTMLFormElement>)
    // On successful verification, open the sign up modal
    setIsSignUpModalOpen(true);
    onOpenChange(false);
  };

  const handleResendCode = () => {
    console.log("Resending verification code to:", phoneNumber);
    if (phoneNumber !== null) {
      generateOTP(phoneNumber)
      // setResendTimer(60);
    }
    // Reset OTP fields
    setOtp(Array(6).fill(""));
    // Focus the first input
    inputRefs.current[0]?.focus();
  };

  const { authentication } = FirebaseData()


  const generateRecaptcha = () => {
    if (typeof window !== 'undefined') {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(authentication, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log('recaptcha resolved..')
          }
        });
      }
    }
  }

  const generateOTP = async (phonenum: string) => {
    try {
      // OTP Generation
      generateRecaptcha();
      const appVerifier = window.recaptchaVerifier as RecaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(authentication, '+' + countryCode + phonenum, appVerifier);
      window.confirmationResult = confirmationResult;
      toast.success(t("otp_sent_to_number") + " " + countryCode + " " + phonenum);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      const errorCode = error.code;
      const errorMessage = getAuthErrorMessage(errorCode);
      toast.error(errorMessage);
    }
  }


  useEffect(() => {
    if (isOpen && phoneNumber !== null) {
      generateOTP(phoneNumber)
    }
    // eslint-disable-next-line
  }, [isOpen, phoneNumber])

  const recaptchaClear = async () => {
    const recaptchaContainer = document.getElementById('recaptcha-container')
    if (recaptchaContainer) {
      recaptchaContainer.innerHTML = ''
    }
    if (window.recaptchaVerifier) {
      // Clear the recaptcha container and reset the verifier
      window.recaptchaVerifier.clear()
    }
  }

  // Handle OTP verification error codes with appropriate error messages
  const handleAuthenticationError = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/missing-verification-code':
        toast.error(t("missing_verification_code"))
        break

      case 'auth/code-expired':
        toast.error(t("verification_code_expired"))
        break

      case 'auth/invalid-verification-code':
        toast.error(t("invalid_verification_code"))
        break

      case 'auth/invalid-verification-id':
        toast.error(t("invalid_verification_id"))
        break

      case 'auth/session-expired':
        toast.error(t("session_expired"))
        break

      case 'auth/quota-exceeded':
        toast.error(t("quota_exceeded"))
        break

      default:
        toast.error(t("unknown_authentication_error"))
        break
    }
  }

  const registerUser = async (mobile: string, idToken: string) => {
    try {
      // Prepare the mobile registration payload (mirrors email signup flow)
      const registrationData: MobileRegistrationRequest = {
        name: userName || "",
        country_code: countryCode,
        mobile: mobile || phoneNumber,
        password,
        confirm_password: confirmPassword,
        fcm_id: settingsData?.fcmtoken,
        firebase_token: idToken,
      };

      // Call the shared mobileRegistration API helper
      const response = await mobileRegistration(registrationData);

      if (response) {
        if (response.error) {
          // API returned an error message (e.g., validation failure)
          toast.error(response.message || t("registration_failed"));
          console.log("API error:", response.message);
        } else if (response.data) {
          // Successful registration
          toast.success(response.message || t("registration_successful"));

          if (response.data.token) {
            dispatch(setToken(response.data.token));
          }

          setPhoneNumber("", "");
          setIsSignUpModalOpen(false);
          onOpenChange(false);
        }
      } else {
        console.log("response is null in component", response);
        toast.error(t("registration_failed"));
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error(t("an_unexpected_error_occurred_during_registration"));
    }
  };

  const submitOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const confirmationResult = window.confirmationResult

    try {
      const response = await confirmationResult.confirm(otp.join(""))
      const idToken = await response.user.getIdToken(); // 👈 fetch idToken
      recaptchaClear()
      console.log('response =>', response)
      if (response.user.phoneNumber) {
        registerUser(response.user.phoneNumber || '', idToken)
        setIsSignUpModalOpen(false)

      }
    } catch (error) {
      handleAuthenticationError((error as FirebaseError).code || 'auth/unknown-error')
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[450px] p-0 bg-white rounded-lg shadow-xl">
          <DialogHeader className="p-6 !pb-0 gap-1">
            <DialogTitle className="text-start text-xl font-semibold text-gray-900">
              {t("verify_your_phone_number")}
            </DialogTitle>
            <DialogDescription className="text-start text-sm text-gray-500">
              {t("we_sent_verification_code_to_your_number")}
            </DialogDescription>
          </DialogHeader>

          {/* divider */}
          <hr className="border-gray-200" />

          {/* Phone number display */}
          <div className="px-6">
            <div className="flex items-center gap-1 mt-1">
              <span className="font-medium text-gray-900">+{countryCode} {phoneNumber}</span>
              {/* here onChange */}
              <button
                className="text-sm primaryColor font-medium"
                onClick={handlePhoneChange}
              >
                {t("change")}
              </button>
            </div>

          </div>

          {/* OTP Input */}
          <div className="px-6 ">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("enter_verification_code")}
            </label>
            <div className="flex gap-2 justify-between">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <div className="px-6">
            <Button
              onClick={handleVerify}
              className="w-full primaryBg text-white font-normal py-2.5 h-12 rounded-md hover:hoverBgColor transition-all duration-300 md:text-xl"
              disabled={otp.join("").length !== 6}
            >
              {t("verify")}
            </Button>
          </div>

          {/* Resend Code */}
          <div className="px-6 mt-4 mb-6 text-center">
            <p className="text-sm text-gray-500">
              {t("didnt_receive_code")} {" "}
              <button
                type="button"
                className="primaryColor font-medium"
                onClick={handleResendCode}
              >
                {t("resend_code")}
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* SignUpWithPhoneNumberModal */}
      <SignUpWithPhoneNumberModal
        isOpen={isSignUpModalOpen}
        onOpenChange={setIsSignUpModalOpen}
        phoneNumber={phoneNumber}
        countryCode={countryCode}
        handlePhoneClick={handlePhoneClick}
        handleEmailClick={handleEmailClick}
        setPhoneNumber={setPhoneNumber}
      />
    </>
  );
};

export default VerifyPhoneModal;
