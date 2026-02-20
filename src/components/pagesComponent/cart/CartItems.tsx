"use client";
import Image from "next/image";
import { FiBookmark, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "@/hooks/useTranslation";
import {
  getCartData,
  removeCourseFromCart,
  setCartData,
  updateCartItemWishlistStatus,
} from "@/redux/reducers/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { removeFromCart } from "@/utils/api/user/get-cart/removeFromCart";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { FaBookmark, FaTag } from "react-icons/fa";
import DataNotFound from "@/components/commonComp/DataNotFound";
import { getAppliedCoupons } from "@/redux/reducers/couponSlice";
import Link from "next/link";
import { isCartPromoAppliedSelector } from "@/redux/reducers/helpersReducer";
import { getCurrencySymbol } from "@/utils/helpers";
import { getCartItems } from "@/utils/api/user/get-cart/getCart";

export default function CartItems() {
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const { toggleWishlist } = useWishlist();

  const cartData = useSelector(getCartData);
  const appliedCoupons = useSelector(getAppliedCoupons);
  const isCartPromoApplied = useSelector(isCartPromoAppliedSelector);

  const [isRemovingItem, setIsRemovingItem] = useState<number | null>(null);
  const [wishlistLoadingItems, setWishlistLoadingItems] = useState<Set<number>>(
    new Set()
  );

  const handleRemoveItem = async (id: number) => {
    try {
      setIsRemovingItem(id);
      const response = await removeFromCart(id);
      if (response && !response.error) {
        toast.success(response.message || "Item removed from cart");

        // Fetch updated cart data from backend
        const updatedCart = await getCartItems();
        if (updatedCart && !updatedCart.error) {
          // Update Redux with fresh, accurate data from backend
          dispatch(setCartData(updatedCart.data));
        } else {
          // Fallback to optimistic update if fetch fails
          dispatch(removeCourseFromCart(id));
        }
      } else {
        toast.error(response?.message || "Failed to remove item");
      }
    } catch (error) {
      console.error("Remove item error:", error);
      toast.error("An unexpected error occurred while removing item");
    } finally {
      setIsRemovingItem(null);
    }
  };

  const handleToggleWishlist = async (id: number, isWishlisted: boolean) => {
    setWishlistLoadingItems((prev) => new Set(prev).add(id));

    try {
      const success = await toggleWishlist(id, isWishlisted);
      if (success) {
        dispatch(
          updateCartItemWishlistStatus({
            courseId: id,
            isWishlisted: !isWishlisted,
          })
        );
        setWishlistLoadingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("An unexpected error occurred while toggling wishlist");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header indicating the number of items */}
      <h2 className="text-xl font-semibold mb-4">
        {t("cart_items_count").replace(
          "{count}",
          cartData?.courses.length?.toString() || "0"
        )}
      </h2>

      {/* Show empty cart state when no items */}
      {(!cartData?.courses || cartData.courses.length === 0) ? (
        <DataNotFound />
      ) : (
        /* Map over the cart items and render each one */
        cartData.courses.map((item) => {
          // Find if there's an applied coupon for this course from Redux
          // Coupons are stored in Redux state when applied to courses
          const appliedCoupon = appliedCoupons.find(
            (applied) => applied.courseId === item.id
          );
          // Get coupon code to display from Redux state if a coupon is applied
          const couponCode = appliedCoupon?.coupon?.promo_code;

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 border border-gray-200 rounded-2xl p-4 relative"
            >
              {/* Optional Coupon Tag - Shows coupon code from Redux state if applied to this course */}
              {/* Display coupon tag if a coupon code exists in Redux state for this course */}
              {couponCode && !isCartPromoApplied && (
                <div className="absolute top-4 right-2 sm:right-4 tertiaryColor text-xs px-2.5 py-0.5 rounded flex items-center gap-1 z-10">
                  <FaTag size={12} />
                  {/* {couponCode} */}
                  Coupon Applied
                </div>
              )}

              {/* Course Image Placeholder */}
              <Link href={`/course-details/${item.slug}`} className="w-full sm:w-32 h-32 sm:h-auto bg-gray-200 rounded flex-shrink-0">
                {/* If imageUrl is provided, use Next/Image */}
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={128} // Adjust width as needed
                    height={128} // Adjust height as needed
                    className="object-cover w-full h-full rounded-2xl"
                  />
                ) : (
                  // Placeholder if no image
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {t("image_placeholder")}
                  </div>
                )}
              </Link>

              {/* Course Details & Actions Combined Flex Container */}
              {/* We use flex-grow to take remaining space and flex-col to stack details and actions */}
              <div className="flex flex-col flex-grow">
                {/* Top section for details */}
                <Link href={`/course-details/${item.slug}`} className="flex-grow space-y-1">
                  {/* <div className="flex items-center gap-2 text-sm text-black">
                <FaStar className="text-[#DB9305]" />
                <span>{item.rating.toFixed(1)}</span>
                <span className="text-gray-500">
                  ({item.reviews.toLocaleString()})
                </span>
              </div> */}
                  <h3 className="text-lg font-semibold">{item.title}</h3>

                  <p className="text-sm">
                    {t("by_label")}{" "}
                    <span className="font-semibold primaryColor underline cursor-pointer">
                      {item.instructor}
                    </span>
                  </p>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-lg font-semibold">
                      {item.display_discount_price === 0
                        ? `${getCurrencySymbol()}${item.display_price?.toFixed(2)}`
                        : `${getCurrencySymbol()}${item.display_discount_price?.toFixed(2)}`}
                    </span>

                    {item.display_price > 0 && item.display_discount_price !== 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        {getCurrencySymbol()}{item.display_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Bottom section for actions, aligned to the right */}
                {/* Adjusted for responsiveness: stacks vertically on xs, row on sm+ */}
                {/* We use flex-col and items-start for mobile, then override with sm prefixes */}
                <div className="flex flex-col items-start gap-2 pt-2 mt-4 sm:flex-row sm:items-center sm:ml-auto sm:mt-auto sm:gap-4 text-sm text-gray-600">
                  <button
                    className="flex items-center gap-1 hover:primaryColor transition-colors cursor-pointer"
                    disabled={wishlistLoadingItems.has(item.id)}
                    onClick={() =>
                      handleToggleWishlist(item.id, item.is_wishlisted)
                    }
                  >
                    {wishlistLoadingItems.has(item.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : item.is_wishlisted ? (
                      <FaBookmark size={16} />
                    ) : (
                      <FiBookmark size={16} />
                    )}

                    {t("move_to_wishlist")}
                  </button>
                  <button
                    className="flex items-center gap-1 hover:text-red-600 transition-colors cursor-pointer"
                    disabled={isRemovingItem === item.id}
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    {isRemovingItem === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FiTrash2 size={16} />
                    )}
                    {t("remove_item")}
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
