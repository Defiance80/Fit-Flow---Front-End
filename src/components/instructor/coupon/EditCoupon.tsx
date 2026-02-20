"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DashboardBreadcrumb from "@/components/instructor/commonCommponents/instructorBreadcrumb/DashboardBreadcrumb";
import { editCouponWithData, CouponCreationFormData } from "@/utils/api/instructor/coupon/editCoupon";
import { getPromoCodeById } from "@/utils/api/instructor/coupon/getCoupons";
import toast from "react-hot-toast";
import CourseMultiSelect from "./CourseMultiSelect";
import { useTranslation } from "@/hooks/useTranslation";
import FormSubmitLoader from "@/components/Loaders/FormSubmitLoader";

// Define a type for form errors
// Maps form field names to error messages
type FormErrors = Record<string, string>;

export default function EditCoupon() {

    const { t } = useTranslation();
    const router = useRouter();
    const { slug } = useParams();
    const id = slug;

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
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [errors, setErrors] = useState<FormErrors>({});

    // Fetch coupon data when component mounts
    // CourseMultiSelect handles its own course fetching internally
    const fetchCouponData = async () => {
        try {
            setIsLoadingData(true);
            const response = await getPromoCodeById(parseInt(id as string));
            if (response) {
                // Check if API returned an error (error: true in response)
                if (!response.error) {
                    if (response.data) {
                        // Populate form with existing coupon data
                        const couponData = response.data;

                        setFormData({
                            coupon_code: couponData.promo_code.toUpperCase(), // Map promo_code to coupon_code
                            message: couponData.message,
                            start_date: couponData.start_date.split('T')[0], // Convert to YYYY-MM-DD format
                            end_date: couponData.end_date.split('T')[0], // Convert to YYYY-MM-DD format
                            discount: couponData.discount,
                            course_ids: couponData.courses.map(course => course.id),
                            // Map no_of_repeat_usage to coupon_usage_limit (or use 0 if not available)
                            coupon_usage_limit: couponData.no_of_users || 0
                        });
                    }
                } else {
                    console.log("API error:", response.message);
                    toast.error(response.message || "Failed to load coupon data");
                }
            } else {
                console.log("response is null in component", response);
                setFormData({
                    coupon_code: "",
                    message: "",
                    start_date: "",
                    end_date: "",
                    discount: 0,
                    course_ids: [],
                    coupon_usage_limit: 0
                });
            }
        } catch (error) {
            console.error("Error fetching coupon data:", error);
            toast.error("Failed to load coupon data. Please try again.");
        } finally {
            setIsLoadingData(false);
        }
    };

    // Load coupon data when component mounts
    // CourseMultiSelect component handles its own course fetching
    useEffect(() => {
        if (id) {
            fetchCouponData();
        }
    }, [id]);

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
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form using Zod
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const apiFormData: CouponCreationFormData = {
                promo_code: formData.coupon_code, // Map coupon_code to promo_code
                message: formData.message,
                start_date: formData.start_date,
                end_date: formData.end_date,
                discount: formData.discount,
                course_ids: formData.course_ids,
                discount_type: "percentage", // Required by API but not in form
                no_of_users: formData.coupon_usage_limit || 0, // Map coupon_usage_limit
            };

            const response = await editCouponWithData(apiFormData, parseInt(id as string));

            if (response.success) {
                toast.success(response.message || "Promo code updated successfully!");
                router.push("/instructor/coupon");
            } else {
                toast.error(response.error || "Failed to update promo code");
            }
        } catch (error) {
            console.error("Error updating promo code:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">

            <DashboardBreadcrumb title={t("edit_coupon")} firstElement={t("coupon")} secondElement={t("edit_coupon")} />

            {/* Main Content */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-medium mb-6">{t("edit_coupon")}</h2>

                {isLoadingData ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center flex flex-col items-center gap-2">
                            <FormSubmitLoader primaryBorder={true} />
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Row 1 - Coupon Code and Message */}
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
                                    value={formData.start_date}
                                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                                // required
                                />
                                {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
                            </div>
                        </div>

                        {/* Row 3 - End Date and Discount Percentage */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="endDate" className="block requireField">
                                    {t("end_date")}
                                </Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    className={`w-full ${errors.end_date ? 'border-red-500' : ''}`}
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

                        {/* Row 4 - Coupon Usage Limit */}
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
                                {isLoading ? t("updating") + "..." : t("update_coupon")}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
