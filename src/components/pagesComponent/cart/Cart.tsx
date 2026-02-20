"use client";

import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/commonComp/Breadcrumb";
import CartItems from "./CartItems";
import BillingDetails from "./BillingDetails";
import { useTranslation } from '@/hooks/useTranslation';
import { useSelector } from 'react-redux';
import { getCartData } from '@/redux/reducers/cartSlice';

export default function Cart() {
  const { t } = useTranslation();
  const cartData = useSelector(getCartData);
  
  // Check if cart has items
  const hasCartItems = cartData?.courses && cartData.courses.length > 0;
  
  return (
    <Layout>  
      <Breadcrumb title={t("course_cart")} firstElement={t("course_cart")} />

      <div className="container pt-14 pb-0 mb-12">
        {/* Grid layout for cart items and billing details */}
        <div className={`grid grid-cols-1 ${hasCartItems ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
          {/* Left column for cart items */}
          <div className={hasCartItems ? "lg:col-span-2" : ""}>
            {/* Render the CartItems component */}
            <CartItems />
          </div>

          {/* Right column for billing details - only show when cart has items */}
          {hasCartItems && (
            <div>
              {/* Render the BillingDetails component */}
              <BillingDetails />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
