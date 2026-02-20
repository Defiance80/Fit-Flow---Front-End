"use client";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { applyPromoCode } from "@/utils/api/user/applyCoupon";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { BillingDetails } from "./BillingDetails";
import { useTranslation } from "@/hooks/useTranslation";
import { getCurrencySymbol } from "@/utils/helpers";
import { settingsSelector } from "@/redux/reducers/settingsSlice";
import { userDataSelector } from "@/redux/reducers/userSlice";
import { UserDetails } from '@/utils/api/user/getUserDetails';
import { fetchUserDeatilsSelector, setFetchUserDeatils } from "@/redux/reducers/helpersReducer";


// Define CartItem type (assuming similar structure)
interface CartItem {
  id: string | number;
  title: string;
  author: string;
  price: number;
  imageUrl?: string;
  discountPrice?: number;
}

// Props interface
interface CheckoutDialogProps {
  cartItems: CartItem[];
  billing: BillingDetails;
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  onProceedToCheckout: (paymentMethod: string, discountData?: any) => void;
  courseId?: number; // Add courseId for discount calculation
}

// Reusable OrderItem component
const OrderItem = ({ item }: { item: CartItem }) => (
  <div className="flex gap-3 border border-gray-200 rounded-lg p-3 mb-3 bg-white">
    <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0">
      {item.imageUrl && (
        <Image
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover rounded"
          width={64}
          height={64}
        />
      )}
    </div>
    <div className="flex-grow text-sm">
      <h4 className="font-medium mb-1">{item.title}</h4>
      <p className="text-xs text-gray-500 mb-1">By {item.author}</p>
    </div>
    <div className="max-[400px]:flex-col max-[400px]:gap-1 flex items-baseline gap-2 pt-1">
      <span className="text-lg font-semibold">
        {item?.discountPrice === 0
          ? `${getCurrencySymbol()}${item?.price?.toFixed(2)}`
          : `${getCurrencySymbol()}${item?.discountPrice?.toFixed(2)}`}
      </span>

      {item?.price > 0 && item?.discountPrice !== 0 && (
        <span className="text-sm text-gray-400 line-through">
          {getCurrencySymbol()}{item.price.toFixed(2)}
        </span>
      )}
    </div>
  </div>
);

export default function CheckoutDialog({
  cartItems,
  billing,
  isOpen,
  onClose,
  onProceedToCheckout,
  courseId,
}: CheckoutDialogProps) {

  const settings = useSelector(settingsSelector);
  const userData = useSelector(userDataSelector) as UserDetails;
  const dispatch = useDispatch();
  const taxType = settings.data.tax_type;
  // State for selected payment method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<string>('stripe');
  const [isCalculatingDiscount, setIsCalculatingDiscount] = React.useState(false);
  const fetchUserDeatils = useSelector(fetchUserDeatilsSelector);

  useEffect(() => {
    if (isOpen) {
      dispatch(setFetchUserDeatils(true));
    }
  }, [isOpen, dispatch]);

  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  const appliedCoupons = useSelector((state: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any 
    courseId ? state.coupon.appliedCoupons.filter((applied: any) => applied.courseId === courseId) : []
  );
  // Use passed cartItems or default placeholders
  const displayItems = cartItems?.length ? cartItems : [];

  // Handle proceed to checkout button click
  const handleProceedClick = async () => {

    // If there are applied coupons and courseId, calculate discount first
    if (appliedCoupons.length > 0 && courseId) {
      setIsCalculatingDiscount(true);

      try {
        // Get the first (and only) applied coupon for single course
        const appliedCoupon = appliedCoupons[0];
        const response = await applyPromoCode(courseId, appliedCoupon.coupon.id, appliedCoupon.promo_code);

        if (response.success && response.data) {
          // Pass the discount data to the parent component
          onProceedToCheckout(selectedPaymentMethod, response.data);
        } else {
          toast.error(response.error || "Failed to calculate discount");
          // Proceed without discount data
          onProceedToCheckout(selectedPaymentMethod);
        }
      } catch (error) {
        console.error("Error calculating discount:", error);
        toast.error("Failed to calculate discount. Proceeding without discount.");
        // Proceed without discount data
        onProceedToCheckout(selectedPaymentMethod);
      } finally {
        setIsCalculatingDiscount(false);
      }
    } else {
      // No coupon applied, proceed normally
      onProceedToCheckout(selectedPaymentMethod);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-6 bg-white rounded-lg shadow-xl overflow-y-auto max-h-[100vh]">
        <DialogHeader>
          <DialogTitle className="sr-only">{t("checkout")}</DialogTitle>
        </DialogHeader>

        {/* Modal Content matches the image layout */}
        <div className="flex flex-col gap-6">
          {/* Payment Methods Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("payment_methods")}</h3>
            <RadioGroup
              value={selectedPaymentMethod}
              onValueChange={setSelectedPaymentMethod}
              className="space-y-3"
            >
              {/* Static Wallet Option - Always Available */}
              {userData?.wallet_balance !== null && userData?.wallet_balance >= billing?.total && (
                <Label
                  htmlFor="wallet"
                  className="flex items-center justify-between border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <div className="flex items-center gap-1">
                      <span className="capitalize">Wallet </span>
                      {fetchUserDeatils ? (
                        <span className="w-12 h-4 bg-gray-200 rounded animate-pulse inline-block"></span>
                      ) : (
                        <span>
                          ({getCurrencySymbol()}
                          {userData?.wallet_balance})
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-bold capitalize italic text-orange-600">Wallet</span>
                </Label>
              )}
              {
                settings?.data?.active_payment_settings?.map((gateway, index) => (
                  <Label
                    key={index}
                    htmlFor={gateway.payment_gateway}
                    className="flex items-center justify-between border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={gateway.payment_gateway} id={gateway.payment_gateway} />
                      <span className="capitalize">{gateway.payment_gateway}</span>
                    </div>
                    <span className={`font-bold capitalize italic ${gateway.payment_gateway === 'stripe' ? 'text-purple-600' : gateway.payment_gateway === 'razorpay' ? 'text-blue-600' : 'text-green-600'}`}>{gateway.payment_gateway}</span>
                  </Label>
                ))
              }
            </RadioGroup>
          </div>

          {/* Order Details Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("order_details")}</h3>
            {displayItems.map((item, index) => (
              <OrderItem key={item.id || index} item={item} />
            ))}
          </div>

          {/* Bill Details Section */}
          <div className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm">
            <h3 className="text-md font-semibold pb-3 mb-4">{t("bill_details")}</h3>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between">
                <span>{t("subtotal")}</span>
                <span>{getCurrencySymbol()}{billing?.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("discount")}</span>
                <span className="text-red-500">
                  -{getCurrencySymbol()}{billing?.discount?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("coupon")}</span>
                <span className="text-red-500">
                  -{getCurrencySymbol()}{billing?.couponDiscount?.toFixed(2)}
                </span>
              </div>
              {taxType === 'exclusive' && (
                <div className="flex justify-between">
                  <span>{t("charges_taxes")}</span>
                  <span>{getCurrencySymbol()}{billing?.taxes?.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-4 mt-4">
              <span className="font-semibold text-md">{t("total")}</span>
              <span className="font-semibold text-md">
                {getCurrencySymbol()}{billing?.total?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Proceed Button */}
          <button
            className="commonBtn w-full"
            onClick={handleProceedClick}
            disabled={isCalculatingDiscount}
          >
            {isCalculatingDiscount ? t("calculating_discount") : t("proceed_to_checkout")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
