import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CgShoppingCart } from "react-icons/cg";
import { Loader2, X } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";
import DataNotFound from "../commonComp/DataNotFound";
import { ScrollArea } from "../ui/scroll-area";
import { useSelector, useDispatch } from "react-redux";
import { getCartData, removeCourseFromCart } from "@/redux/reducers/cartSlice";
import { isLoginSelector } from "@/redux/reducers/userSlice";
import { removeFromCart } from "@/utils/api/user/get-cart/removeFromCart";
import toast from "react-hot-toast";
import { getCurrencySymbol } from "@/utils/helpers";
import { setIsLoginModalOpen } from "@/redux/reducers/helpersReducer";
import { currentLanguageSelector } from "@/redux/reducers/languageSlice";

const CartDropdown = ({ isMobileNav }: { isMobileNav?: boolean }) => {
  const currentLanguageCode = useSelector(currentLanguageSelector);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cartData = useSelector(getCartData);
  const [isRemovingItem, setIsRemovingItem] = useState<number | null>(null);
  const isLogin = useSelector(isLoginSelector);

  const handleRemoveItem = async (id: number) => {
    try {
      setIsRemovingItem(id);
      const response = await removeFromCart(id);
      if (response && !response.error) {
        toast.success(response.message || "Item removed from cart");
        dispatch(removeCourseFromCart(id));
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

  const handleCartOpen = () => {
    if (isLogin) {
      setIsCartOpen(true);
    } else {
      toast.error(t("login_first"));
      dispatch(setIsLoginModalOpen(true));
    }
  };

  return (
    <div
      className="relative h-full"
      onMouseLeave={() => { setIsCartOpen(false) }}
    >
      <DropdownMenu open={isLogin && isCartOpen} onOpenChange={setIsCartOpen}>
        <DropdownMenuTrigger asChild onClick={() => handleCartOpen()}>
          <div
            className={`col-span- w-max  ${!isMobileNav && 'border borderColor bg-[#F8F8F9]'} flexCenter justify-start p-3 rounded-[4px] h-full cursor-pointer hover:primaryBg hover:text-white transition-all duration-300`}
          >
            {isLogin && (
              <span className={`primaryBg text-white rounded-full absolute ${isMobileNav ? '-right-1 -top-1 w-[22px] h-[22px]' : '-right-2 -top-3 w-[24px] h-[24px] '} flexCenter text-sm border border-white`}>
                {cartData?.courses?.length || 0}
              </span>
            )}
            <CgShoppingCart size={24} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[250px] sm:w-[380px] h-[500px] overflow-y-auto sm:h-auto max-575:bottom-0 -mt-1 border-none shadow-lg"
          align={isMobileNav ? "start" : "end"}
          onMouseLeave={() => setIsCartOpen(false)}
        >
          <div
            className="flex flex-col bg-white z-[2] w-full p-4 shadow-[0px_7px_28px_2px_#ADB3B83D]"
            onMouseLeave={() => {
              setIsCartOpen(false);
            }}
          >
            {cartData?.courses && cartData?.courses?.length > 0 ? (
              <ScrollArea className="h-[300px] pr-4">
                {cartData.courses.map((item) => (
                  <div key={item.id} className="py-4 border-b border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <Image
                          className="size-12 rounded object-cover"
                          src={item.thumbnail}
                          alt={item.title}
                          width={48}
                          height={48}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Link href={`/course-details/${item.slug}?lang=${currentLanguageCode}`}>
                          <h3 className="break-all hover:underline hover:text-primaryColor">{item.title}</h3>
                        </Link>
                        <p className="text-gray-500 text-sm">
                          {item.instructor}
                        </p>
                        <div className="flex items-center">
                          <span className="font-bold">
                            {item.display_discount_price === 0
                              ? `${getCurrencySymbol()}${item.display_price.toFixed(2)}`
                              : `${getCurrencySymbol()}${item.display_discount_price.toFixed(2)}`}
                          </span>

                          {item.display_price > 0 && item.display_discount_price !== 0 &&
                            <span className="text-gray-500 text-sm line-through ml-2">
                              {getCurrencySymbol()}{item.display_price.toFixed(2)}
                            </span>
                          }
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="flex-shrink-0 rounded-full h-5 w-5 flex items-center justify-center bg-[#DB3D26] text-white ml-auto"
                        disabled={isRemovingItem === item.id}
                      >
                        {isRemovingItem === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <DataNotFound />
            )}

            {cartData?.courses && cartData?.courses?.length > 0 && (
              <>
                <div className="bg-[#F2F5F7] p-4 rounded-[4px] mt-4 mb-4 border borderColor">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{t("total")}</span>
                    <div>
                      <span className="font-bold">
                        {getCurrencySymbol()}{cartData?.total_price.toFixed(2)}
                      </span>
                      {/* Only show strike-through if subtotal > total */}
                      {cartData.subtotal_price > cartData.total_price && (
                        <span className="text-gray-500 text-sm line-through ml-2">
                          {getCurrencySymbol()}{cartData.subtotal_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/cart?lang=${currentLanguageCode}`}
                  className="w-full commonBtn flexCenter gap-1 rounded-[4px]"
                >
                  <span>{t("process_to_cart")}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CartDropdown;
