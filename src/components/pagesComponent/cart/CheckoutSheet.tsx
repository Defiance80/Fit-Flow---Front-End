"use client";
import React from "react";
import { SheetContent, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import CustomImageTag from "@/components/commonComp/customImage/CustomImageTag";

// Define a basic CartItem type (adjust fields as needed)
interface CartItem {
  id: string | number;
  title: string;
  author: string;
  price: number;
  imageUrl?: string;
  discountPrice?: number;
}

// Update props interface
interface CheckoutSheetProps {
  cartItems: CartItem[]; // Use the defined type
  billing: {
    subtotal: number;
    discount: number;
    couponDiscount: number;
    taxes: number;
    total: number;
  };
}

// Sample Order Item structure (adjust as needed based on CartItems.tsx)
const OrderItem = ({ item }: { item: CartItem }) => (
  <div className="flex gap-3 border border-gray-200 rounded-lg p-3 mb-3">
    {/* Placeholder image */}
    <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0">
      {item.imageUrl && (
        <CustomImageTag
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover rounded"
        />
      )}
    </div>
    <div className="flex-grow text-sm">
      <h4 className="font-medium mb-1">
        {item.title || "UI Design Fundamentals"}
      </h4>
      <p className="text-xs text-gray-500 mb-1">
        By {item.author || "Emily Wright"}
      </p>
    </div>
    <div className="text-sm font-semibold flex-shrink-0">
      ${(item.price || 59.0).toFixed(2)}
    </div>
  </div>
);

export default function CheckoutSheet({
  cartItems,
  billing,
}: CheckoutSheetProps) {
  // Use passed cartItems or default placeholders
  const displayItems = cartItems?.length
    ? cartItems
    : [
      {
        id: 1,
        title: "UI Design Fundamentals",
        author: "Emily Wright",
        price: 59.0,
      },
      {
        id: 2,
        title: "UI Design Fundamentals",
        author: "Emily Wright",
        price: 59.0,
      },
      {
        id: 3,
        title: "UI Design Fundamentals",
        author: "Emily Wright",
        price: 59.0,
      },
    ];

  return (
    <SheetContent
      side="bottom"
      className="rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto bg-white"
    >
      {/* Custom Close Button */}
      <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary z-10">
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </SheetClose>

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
        <RadioGroup defaultValue="stripe" className="space-y-3">
          <Label
            htmlFor="stripe"
            className="flex items-center justify-between border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="stripe" id="stripe" />
              <span>Stripe</span>
            </div>
            <span className="font-bold text-purple-600">stripe</span>
          </Label>
          <Label
            htmlFor=" razorpay"
            className="flex items-center justify-between border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="razorpay" id="razorpay" />
              <span>Razorpay</span>
            </div>
            <span className="font-bold text-blue-600 italic">Razorpay</span>
          </Label>
          <Label
            htmlFor="flutterwave"
            className="flex items-center justify-between border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="flutterwave" id="flutterwave" />
              <span>Flutterwave</span>
            </div>
          </Label>
        </RadioGroup>
      </div>

      {/* Order Details */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Order Details</h3>
        {displayItems.map((item, index) => (
          <OrderItem key={item.id || index} item={item} />
        ))}
      </div>

      {/* Bill Details - Replicated structure from original BillingDetails */}
      <div className="mb-8 border border-gray-200 rounded-2xl p-4 bg-white shadow-sm">
        <h3 className="text-md font-semibold pb-3 mb-4">Bill Details</h3>
        <div className="space-y-3 text-sm mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${billing.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount (25% off)</span> {/* Static text based on image */}
            <span className="text-red-500">
              -${billing.discount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Coupon</span>
            <span className="text-red-500">
              -${billing.couponDiscount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Charges & Taxes</span>
            <span>${billing.taxes.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-4 mt-4">
          <span className="font-semibold text-md">Total</span>
          <span className="font-semibold text-md">
            ${billing.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Proceed Button */}
      <Button className="w-full primaryBg text-white h-12 font-semibold text-base hover:primaryColor">
        Proceed to checkout
      </Button>
    </SheetContent>
  );
}
