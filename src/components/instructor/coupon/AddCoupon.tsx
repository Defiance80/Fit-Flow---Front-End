"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DashboardBreadcrumb from "@/components/instructor/commonCommponents/instructorBreadcrumb/DashboardBreadcrumb";
import { createCouponWithData, CouponCreationFormData } from "@/utils/api/instructor/coupon/createCoupon";
import toast from "react-hot-toast";
import CourseMultiSelect from "./CourseMultiSelect";
import { useTranslation } from "@/hooks/useTranslation";

// Define a type for form errors
// Maps form field names to error messages
type FormErrors = Record<string, string>;

export default function AddNewCoupon() {

  const { t } = useTranslation();
  const router = useRouter();

  // Zod schema for form validation
  // This schema validates only the fields that are present in the form
  const couponFormSchema = z.object({
    coupon_code: z.string()
      .min(1, t("coupon_code_is_required"))
      .max(50, t("coupon_code_must_be_less_than_50_characters"))
      .regex(/^[A-Z0-9]+$/, t("coupon_code_must_contain_only_uppercase_letters_and_numbers")),
    message: z.string()
      .min(1, t("message_is_required"))
      .max(200, t("message_must_be_less_than_200_characters")),
    start_date: z.string()
      .min(1, t("start_date_is_required")),
    end_date: z.string()
      .min(1, t("end_date_is_required")),
    discount: z.number()
      .min(1, t("discount_must_be_greater_than_0"))
      .max(100, t("discount_cannot_exceed_100")),
    course_ids: z.array(z.number())
      .min(1, t("please_select_at_least_one_course"))
      .max(50, t("cannot_select_more_than_50_courses")),
    coupon_usage_limit: z.number()
      .min(0, t("coupon_usage_limit_must_be_0_or_greater"))
      .max(100, t("coupon_usage_limit_cannot_exceed"))
      .optional(),
  }).refine((data) => {
    // Ensure start date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (data.start_date) {
      const startDate = new Date(data.start_date);
      startDate.setHours(0, 0, 0, 0);
      return startDate >= today;
    }
    return true;
  }, {
    message: t("start_date_cannot_be_in_past"),
    path: ["start_date"]
  }).refine((data) => {
    // Ensure end date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (data.end_date) {
      const endDate = new Date(data.end_date);
      endDate.setHours(0, 0, 0, 0);
      return endDate >= today;
    }
    return true;
  }, {
    message: t("end_date_cannot_be_in_past"),
    path: ["end_date"]
  }).refine((data) => {
    // Validate that end date is after start date
    if (data.start_date && data.end_date) {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      return endDate > startDate;
    }
    return true;
  }, {
    message: t("end_date_must_be_after_start_date"),
    path: ["end_date"]
  });

  const todayISO = new Date().toISOString().split("T")[0];

  // Form state - only fields that are in the form
  // Note: We use 'coupon_code' in form but map to 'promo_code' when submitting to API
  const [formData, setFormData] = useState({
    coupon_code: "",
    message: "",
    start_date: "",
    end_date: "",
    discount: 0,
    course_ids: [] as number[],
    coupon_usage_limit: 0
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Validate form using Zod
  // This function validates the form data against the Zod schema and sets error states
  const validateForm = () => {
    try {
      // Validate form data with Zod schema
      couponFormSchema.parse(formData);

      // Clear all errors if validation passes
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to our error format for display in UI
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path && err.path.length > 0) {
            const fieldName = err.path[0] as string;
            newErrors[fieldName] = err.message;
          }
        });

        setErrors(newErrors);
        toast.error(t("fix_the_validation_errors"));
      }
      return false;
    }
  };

  // Handle input changes
  // Handles changes to form fields and clears errors when user starts typing
  const handleInputChange = (field: keyof typeof formData, value: string | number | number[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({
        ...prev,
        [field as string]: ""
      }));
    }
  };

  // Handle form submission
  // Maps form data to API format and submits the coupon creation request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form using Zod
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Map UI state into payload expected by the coupon API
      const apiFormData: CouponCreationFormData = {
        promo_code: formData.coupon_code.toUpperCase(),
        message: formData.message,
        start_date: formData.start_date,
        end_date: formData.end_date,
        discount: formData.discount,
        course_ids: formData.course_ids,
        // coupon_usage_limit: formData.coupon_usage_limit,
        no_of_users: formData.coupon_usage_limit,
      };

      // Call coupon creation API
      const response = await createCouponWithData(apiFormData);

      // Handle null responses (network failure or unexpected issue)
      if (!response) {
        console.log("createCouponWithData returned null", response);
        toast.error(t("something_went_wrong"));
        return;
      }

      // Success state mirrors quiz flow logic
      if (response.success) {
        toast.success(response.message || t("promo_created_success"));
        router.push("/instructor/coupon");
        return;
      }

      // API returned an error: show message and log for debugging
      console.log("Coupon creation failed:", response);
      toast.error(response.error || response.message || t("promo_creation_failed"));
    } catch (error) {
      console.error("Error creating promo code:", error);
      toast.error(t("unexpected_error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">

      <DashboardBreadcrumb title={t("add_new_coupon")} firstElement={t("coupon")} secondElement={t("add_new_coupon")} />

      {/* Main Content */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-6">{t("add_new_coupon")}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1 - Promo Code and Message */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="couponCode" className="block requireField">
                {t("coupon_code")}
              </Label>
              <Input
                id="couponCode"
                placeholder="e.g SAVE5009"
                className={`w-full ${errors.coupon_code ? 'border-red-500' : ''} uppercase`}
                value={formData.coupon_code.toUpperCase()}
                onChange={(e) => handleInputChange('coupon_code', e.target.value.toUpperCase())}
              // required
              />
              {errors.coupon_code && <p className="text-red-500 text-sm">{errors.coupon_code}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="block requireField">
                {t("message")}
              </Label>
              <Input
                id="message"
                placeholder="e.g Get 50% off this course!"
                className={`w-full ${errors.message ? 'border-red-500' : ''}`}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
              // required
              />
              {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
            </div>
          </div>

          {/* Row 2 - Select Course and Start Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="selectCourse" className="block requireField">
                {t("select_courses")}
              </Label>
              <CourseMultiSelect
                selectedCourseIds={formData.course_ids}
                onCourseChange={(courseIds) => handleInputChange('course_ids', courseIds)}
                className={errors.course_ids ? 'border-red-500' : ''}
              />
              {errors.course_ids && <p className="text-red-500 text-sm">{errors.course_ids}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate" className="block requireField">
                {t("start_date")}
              </Label>
              <Input
                id="startDate"
                type="date"
                className={`w-full ${errors.start_date ? 'border-red-500' : ''}`}
                min={todayISO}
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
              // required
              />
              {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
            </div>
          </div>

          {/* Row 3 - End Date and Minimum Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="endDate" className="block requireField">
                {t("end_date")}
              </Label>
              <Input
                id="endDate"
                type="date"
                className={`w-full ${errors.end_date ? 'border-red-500' : ''}`}
                min={todayISO}
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
              // required
              />
              {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount" className="block requireField">
                {t("discount_percentage") + ` (${t("in")} %)`}
              </Label>
              <Input
                id="discount"
                type="number"
                placeholder="e.g 50"
                className={`w-full ${errors.discount ? 'border-red-500' : ''}`}
                value={formData.discount || ''}
                onChange={(e) => handleInputChange('discount', parseInt(e.target.value) || 0)}
              // required
              />
              {errors.discount && <p className="text-red-500 text-sm">{errors.discount}</p>}
            </div>
          </div>

          {/* Row 6 - Repeat Usage and Number of Repeat Usage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="noOfRepeatUsage">
                {t("coupon_usage_limit")}
              </Label>
              <Input
                id="noOfRepeatUsage"
                type="number"
                placeholder="e.g 00"
                className="w-full"
                value={formData.coupon_usage_limit || ''}
                onChange={(e) => handleInputChange('coupon_usage_limit', parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("default_usage")}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? t("creating") + "..." : t("add_new_coupon")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
