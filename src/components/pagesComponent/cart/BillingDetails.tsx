"use client";
import React, { useEffect, useState } from "react";
import { GoTag } from "react-icons/go";
import { FiTrash2 } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
// Import Loader icon for spinner
import { Loader2 } from "lucide-react";

// Import Shadcn Dialog component (no trigger needed now)
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CheckoutDialog from "./CheckoutDialog";
import CouponDialog from "./CouponDialog";
import { useTranslation } from '@/hooks/useTranslation';
import { useDispatch, useSelector } from 'react-redux';
import { getCartData, updateCartFromResponse } from '@/redux/reducers/cartSlice';
import toast from 'react-hot-toast';
import { cartCheckout, CartCheckoutData } from '@/utils/api/user/placeOrder';
import { clearAllCoupons, getAppliedCoupons, applyCoupon } from "@/redux/reducers/couponSlice";
import { removePromo } from '@/utils/api/user/get-cart/removeCoupon';
import { setIsCartPromoApplied, setIsLoginModalOpen } from "@/redux/reducers/helpersReducer";
import { getCurrencySymbol } from "@/utils/helpers";
import { applyAdminPromo } from '@/utils/api/user/get-cart/applyAdminPromo';
import { getAdminCoupons, AdminCoupon } from '@/utils/api/user/get-cart/getAdminCoupon';
import { settingsSelector } from "@/redux/reducers/settingsSlice";
import { isLoginSelector } from "@/redux/reducers/userSlice";

export interface BillingDetails {
  subtotal: number;
  discount: number;
  couponDiscount: number;
  taxes: number;
  total: number;
}

export default function BillingDetails() {

  const dispatch = useDispatch();

  // Get cart data from Redux store
  const cartData = useSelector(getCartData);
  const { t } = useTranslation();

  const settings = useSelector(settingsSelector);
  const isLogin = useSelector(isLoginSelector);
  const taxType = settings.data.tax_type;

  // State to manage the coupon code input
  const [couponCode, setCouponCode] = useState("");
  // State for loading and dialog visibility
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  // State for applying coupon loading
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  // State to cache available admin coupons
  const [availableCoupons, setAvailableCoupons] = useState<AdminCoupon[]>([]);

  const subtotal = cartData?.total_display_price || 0;
  const discount = cartData?.discount || 0;
  const couponDiscount = cartData?.promo_discounts?.reduce((acc, curr) => acc + Number(curr.discount_amount), 0) || 0; // TODO: Get from actual coupon data
  const taxes = cartData?.total_tax_amount || 0; // TODO: Calculate actual taxes
  const total = cartData?.final_total || (subtotal - discount - couponDiscount + taxes);

  const [billingDetails, setBillingDetails] = useState({
    subtotal: subtotal,
    discount: discount,
    couponDiscount: couponDiscount,
    taxes: taxes,
    total: total,
  });

  const appliedCoupons = useSelector(getAppliedCoupons);
  const appliedCouponDetails = appliedCoupons?.[0];

  useEffect(() => {
    const calculatedSubtotal = cartData?.total_display_price || 0;
    const calculatedDiscount = cartData?.discount || 0;
    const calculatedCouponDiscount = cartData?.promo_discounts?.reduce((acc, curr) => acc + Number(curr.discount_amount), 0) || 0;
    const calculatedTaxes = cartData?.total_tax_amount || 0;

    // Calculate total: use final_total from backend, or calculate manually
    const calculatedTotal = cartData?.final_total ||
      (calculatedSubtotal - calculatedDiscount - calculatedCouponDiscount + calculatedTaxes);

    setBillingDetails({
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      couponDiscount: calculatedCouponDiscount,
      taxes: calculatedTaxes,
      total: calculatedTotal,
    });
  }, [cartData]);

  // Convert cart data to format expected by CheckoutDialog
  const cartItemsData = cartData?.courses?.map(course => ({
    id: course.id,
    title: course.title,
    author: course.instructor,
    price: course.display_price,
    discountPrice: course.display_discount_price,
    imageUrl: course.thumbnail,
  })) || [];


  // Function to handle applying coupon from input field
  // This follows the same pattern as hanldeReedemAdminCoupon in CouponDialog.tsx
  const handleApplyCoupon = async () => {
    // Validate coupon code is not empty
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    // Check if user is authenticated
    if (!isLogin) {
      dispatch(setIsLoginModalOpen(true));
      toast.error(t("login_first"));
      return;
    }

    // Set loading state
    setIsApplyingCoupon(true);

    try {
      // First, fetch available admin coupons if we don't have them yet
      let couponsToSearch = availableCoupons;

      if (couponsToSearch.length === 0) {
        // Fetch available admin coupons
        const couponsResponse = await getAdminCoupons();

        if (couponsResponse && couponsResponse.data && Array.isArray(couponsResponse.data)) {
          setAvailableCoupons(couponsResponse.data);
          couponsToSearch = couponsResponse.data;
        } else {
          // If API returns error, we can still try to apply the code directly
          // The API might validate it anyway
          console.log("Could not fetch available coupons, trying to apply code directly");
        }
      }

      // Find the coupon in available coupons by code (case-insensitive)
      // If we have coupons, find the matching one
      const couponToApply = couponsToSearch.length > 0
        ? couponsToSearch.find(
          (coupon) => coupon.promo_code.toLowerCase() === couponCode.trim().toLowerCase()
        )
        : null;

      // If we found the coupon, use its ID; otherwise, just use the code
      const couponId = couponToApply?.id;
      const codeToApply = couponCode.trim();

      // Call the API to apply admin promo code to cart
      // applyAdminPromo expects: token, promoCode, promoCodeId (optional)
      const response = await applyAdminPromo(
        codeToApply,
        couponId
      );

      if (response) {
        // Check if API returned an error
        if (response.error) {
          console.log("API error:", response.message);
          toast.error(response.message || "Failed to apply coupon");
        } else if (response.data) {
          // Success - transform response data to match CartData format
          // ApplyAdminPromoData might be missing tax_amount and discount_price fields
          // The API response should include these, but we add defaults if missing
          const cartDataResponse = {
            ...response.data,
            // Add missing fields if not present in response
            // These fields might be returned by API but not defined in interface
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tax_amount: (response.data as any).tax_amount || 0,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            discount_price: (response.data as any).discount_price || response.data.discount || 0,
          };

          // Update cart state from response
          // Cast to CartData since ApplyAdminPromoData structure is compatible
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dispatch(updateCartFromResponse(cartDataResponse as any));

          // If we found the coupon in available coupons, update Redux state
          // Use the first course ID from cart for Redux state (admin coupons apply to all courses)
          // This follows the same pattern as CouponDialog.tsx
          if (couponToApply && cartData?.courses?.[0]?.id) {
            // Pass AdminCoupon directly to Redux (it's compatible with CourseCoupon structure)
            dispatch(applyCoupon({
              courseId: cartData.courses[0].id,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              coupon: couponToApply as any
            }));
          }

          // Set cart promo applied flag
          dispatch(setIsCartPromoApplied(true));

          // Clear the input field on success
          setCouponCode("");

          // Show success message
          toast.success(`Coupon "${codeToApply}" applied successfully!`);
        }
      } else {
        console.log("response is null in component", response);
        toast.error("Failed to apply coupon. Please try again.");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Failed to apply coupon. Please try again.");
    } finally {
      // Reset loading state
      setIsApplyingCoupon(false);
    }
  };


  // Function to handle removing promo code from cart
  // This follows the same pattern as hanldeReedemAdminCoupon in CouponDialog.tsx
  const handleRemoveCouponApi = async () => {
    try {
      // Call the API to remove promo code from cart
      const response = await removePromo();

      if (response) {
        // Check if API returned an error
        if (response.error) {
          console.log("API error:", response.message);
          toast.error(response.message || "Failed to remove coupon");
        } else if (response.data) {
          // Success - transform response data to match CartData format
          // ApplyAdminPromoData might be missing tax_amount and discount_price fields
          // The API response should include these, but we add defaults if missing
          const cartData = {
            ...response.data,
            // Add missing fields if not present in response
            // These fields might be returned by API but not defined in interface
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tax_amount: (response.data as any).tax_amount || 0,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            discount_price: (response.data as any).discount_price || response.data.discount || 0,
          };

          // Update cart state from response
          // Cast to CartData since ApplyAdminPromoData structure is compatible
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dispatch(updateCartFromResponse(cartData as any));
          dispatch(setIsCartPromoApplied(false));

          // Show success message
          toast.success(response.message || "Coupon removed successfully!");
        }
      } else {
        console.log("response is null in component", response);
        toast.error("Failed to remove coupon. Please try again.");
      }
    } catch (error) {
      console.error("Error removing coupon:", error);
      toast.error("Failed to remove coupon. Please try again.");
    }
  };

  // Handle remove coupon - clear from Redux and call API
  const handleRemoveCoupon = async () => {
    // Clear coupons from Redux state immediately
    dispatch(clearAllCoupons());
    // Call API to remove promo code from cart
    await handleRemoveCouponApi();
  };

  useEffect(() => {
    console.log('billingDetails', billingDetails);
  }, [billingDetails]);

  // Function to handle checkout click
  const handleCheckoutClick = () => {
    setIsLoading(true);
    // Simulate loading delay (e.g., 1500ms)
    setTimeout(() => {
      setIsLoading(false);
      setIsDialogOpen(true); // Open the dialog after loading
    }, 1500);
  };

  const handleProceedToCheckout = async (
    paymentMethod: string
  ): Promise<void> => {
    console.log(
      "handleProceedToCheckout called with paymentMethod:",
      paymentMethod
    );

    // Validate payment method
    const validMethods = ["wallet", "stripe", "flutterwave", "razorpay"];
    if (!validMethods.includes(paymentMethod)) {
      toast.error(`Invalid payment method. Supported methods: ${validMethods.join(', ')}`);
      return;
    }

    // Check if user is authenticated (using static token for testing)
    if (!isLogin) {
      dispatch(setIsLoginModalOpen(true));
      toast.error(t("login_first"));
      return;
    }

    // Close checkout dialog
    setIsDialogOpen(false);

    console.log("Starting payment process...");

    try {
      // Prepare cart checkout data for the API (no course_id needed)
      const checkoutData: CartCheckoutData = {
        payment_method: paymentMethod,

        ...(couponCode && { promo_code_ids: [couponCode] }),
      };

      const response = await cartCheckout(checkoutData);

      if (response.success) {
        // Check if the API response indicates success
        if (response.data && !response.data.error) {
          // Show success message for order creation
          if (paymentMethod === "wallet") {
            toast.success(response.data.message || "Order placed successfully!");
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            return;
          }

          // Extract payment details from the response
          const paymentData = response.data.data?.payment as unknown as { provider: string; url: string } | undefined;

          if (paymentData && paymentData.provider) {
            // Show loading message and redirect to Stripe checkout URL
            toast.success(`${response.data.message || "Order placed successfully!"} - Redirecting to secure ${paymentData.provider} payment page...`);

            // Small delay to show the toast message before redirect
            setTimeout(() => {
              window.location.href = paymentData.url;
            }, 1000);
          } else {
            // Handle unsupported payment methods or missing payment data
            toast.error("Payment method not supported or payment data missing");
            console.error(
              "Payment data missing or unsupported provider:",
              paymentData
            );
          }
        } else {
          // Handle API error response
          const errorMessage =
            response.data?.message ||
            response.message ||
            "Failed to place order";
          toast.error(errorMessage);

          // If user already purchased the course, show specific message
          if (response.data?.code === 422) {
            toast.error("You have already purchased this course.");
          }
        }
      } else {
        // Handle API call failure
        toast.error(
          response.message || "Failed to place order. Please try again."
        );
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Failed to process payment. Please try again.");
    } finally {
    }
  };


  return (
    // Control Dialog visibility with state
    <>
      {/* Billing Details Card */}
      <div className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm lg:mt-11">
        <h2 className="text-md font-semibold pb-3 mb-4">{t('bill_details')}</h2>

        {/* Bill Breakdown */}
        <div className="space-y-3 text-sm mb-4">
          <div className="flex justify-between">
            <span>{t('subtotal')}</span>
            <span>{getCurrencySymbol()}{billingDetails.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            {/* TODO: Clarify if the 25% off text is static or dynamic */}
            <span>{t('discount')}</span>
            <span className="text-red-500">-{getCurrencySymbol()}{billingDetails.discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('coupon')}</span>
            <span className="text-red-500">-{getCurrencySymbol()}{billingDetails.couponDiscount.toFixed(2)}</span>
          </div>
          {taxType === "exclusive" && (
            <div className="flex justify-between">
              <span>{t('charges_taxes')}</span>
              <span>{getCurrencySymbol()}{taxes.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between">
          <span className="font-semibold text-md">{t('total')}</span>
          <span className="font-semibold text-md">{getCurrencySymbol()}{total.toFixed(2)}</span>
        </div>

        {/* Apply Coupon Section - Only show if no coupons are applied */}
        <div className="space-y-3 border-t border-gray-200 pt-4 mt-6">
          {/* Coupon Section */}
          {
            !appliedCouponDetails &&
            <div className="space-y-3 flex justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <GoTag className="bg-transparent" />
                {t('apply_coupon')}
              </h3>
              <Dialog
                open={isCouponDialogOpen}
                onOpenChange={setIsCouponDialogOpen}
              >
                <DialogTrigger asChild>
                  <p className="text-xs primaryColor cursor-pointer underline">
                    {t('view_coupons')}
                  </p>
                </DialogTrigger>
                <CouponDialog
                  courseId={cartData?.courses?.[0]?.id || 0}
                  onClose={() => setIsCouponDialogOpen(false)}
                  cartPage={true}
                />
              </Dialog>
            </div>
          }

          {/* Display applied coupon if present */}
          {appliedCouponDetails && (
            <div className="text-sm tertiaryColor space-y-1 mb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 font-medium">
                  <FaCheckCircle />
                  <p>
                    {t('coupon_code_applied')}
                    {" "}
                    <span className="font-bold">{`"${appliedCouponDetails?.coupon?.promo_code}"`}</span>
                  </p>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  title={t('remove_coupon')}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Coupon input form - Always render this */}
          {
            !appliedCouponDetails &&
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder={t('enter_code')}
                className="flex-grow border border-gray-300 rounded-[5px] h-12 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:primaryColor"
              />
              <Button
                onClick={handleApplyCoupon}
                className="absolute right-1.5 cursor-pointer top-1.5 bottom-1.5 primaryBg text-white px-4 rounded-[5px] text-sm font-medium hover:primaryColor transition-colors disabled:opacity-50 h-auto"
                disabled={!couponCode || isApplyingCoupon}
              >
                {isApplyingCoupon ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t('apply')
                )}
              </Button>
            </div>
          }
        </div>

        {/* Checkout Button - No longer a trigger, handles click directly */}
        <Button
          onClick={handleCheckoutClick}
          disabled={isLoading} // Disable button while loading
          className="w-full primaryBg text-white cursor-pointer py-3 rounded-[5px] font-semibold transition-colors mt-6 h-auto flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" /> // Show spinner when loading
          ) : (
            t('checkout') // Show text otherwise
          )}
        </Button>
      </div >

      {/* Checkout Dialog - handles its own dialog state */}
      <CheckoutDialog
        cartItems={cartItemsData}
        billing={billingDetails}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)
        }
        onProceedToCheckout={handleProceedToCheckout}
      />
    </>
  );
}
