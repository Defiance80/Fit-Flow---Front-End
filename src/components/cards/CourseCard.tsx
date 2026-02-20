'use client'
import { FaStar, FaBookmark } from "react-icons/fa";
import Link from "next/link";
import { RiDiscountPercentFill } from "react-icons/ri";
import { FaRegBookmark } from "react-icons/fa";
import { useEffect, useState } from "react";
import CustomImageTag from "../commonComp/customImage/CustomImageTag";
import { useWishlist } from "@/hooks/useWishlist";
import { Course } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import { formatCount, getCurrencySymbol } from "@/utils/helpers";
import { useSelector } from "react-redux";
import { currentLanguageSelector } from "@/redux/reducers/languageSlice";

interface dataProps {
  courseData: Course;
  onWishlistToggle?: (courseId: number, newStatus: boolean) => void; // Add callback for wishlist toggle
}

const CourseCard: React.FC<dataProps> = ({ courseData, onWishlistToggle }) => {

  const { t } = useTranslation();
  const currentLanguageCode = useSelector(currentLanguageSelector)

  const [isbookmarked, setIsbookmarked] = useState(false);

  // Add this line to use the wishlist hook
  const { toggleWishlist, isLoading: wishlistLoading } = useWishlist();

  useEffect(() => {
    setIsbookmarked(courseData?.is_wishlisted || false);
  }, [courseData?.is_wishlisted]);

  // Get course image
  const courseImage = courseData?.image;

  // Updated function to handle bookmark toggle clicks
  const handleBookmarkClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Call the toggle wishlist API
    const success = await toggleWishlist(courseData.id.toString(), isbookmarked);

    // Update local state only if API call was successful
    if (success) {
      const newStatus = !isbookmarked;
      setIsbookmarked(newStatus);
      // Call the parent callback to update state locally without page reload
      if (onWishlistToggle) {
        onWishlistToggle(courseData.id, newStatus);
      }
    }
  };

  return (
    <Link href={`/course-details/${courseData?.slug || courseData?.id}?lang=${currentLanguageCode}`}>
      <div className="rounded-[16px] overflow-hidden bg-white flex flex-col gap-4 h-full border borderColor p-3 md:p-4 group">
        <div className="relative bg-gray-200 aspect-video w-full rounded-[16px]">
          <CustomImageTag
            src={courseImage}
            alt={courseData?.title}
            className="max-w-[355px] h-[251px] w-full rounded-[16px]"
          />
          {/* Update this button to use the wishlist functionality */}
          <button
            onClick={(e) => handleBookmarkClick(e)}
            disabled={wishlistLoading}
            className={`absolute top-2 right-2 bg-white rounded-full border ${isbookmarked && 'primaryBorder'} !border-black p-2 group/bookmark hover:primaryBorder transition-all duration-300  ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {
              isbookmarked ? (
                <FaBookmark className="primaryColor" size={18} />
              ) : (
                <FaRegBookmark className="group-hover/bookmark:primaryColor transition-all duration-300" size={18} />
              )
            }
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="primaryLightBg primaryColor py-1 px-3 rounded-full text-sm capitalize">
              {courseData?.level}
            </span>
            <div className="flexCenter gap-1">
              {courseData?.average_rating && courseData?.average_rating > 0 ? (
                <div className="flexCenter gap-1">
                  <FaStar className="text-[#DB9305] text-sm" />
                  <span className="font-semibold">{courseData?.average_rating}</span>
                </div>
              ) : null}
              {courseData?.ratings && courseData?.ratings > 0 ? (
                <>
                  <span>|</span>
                  <span className="">{formatCount(courseData?.ratings)}</span>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="font-semibold group-hover:primaryColor transition-all duration-300 line-clamp-2">{courseData?.title}</h3>
            <p className="text-sm secondaryText line-clamp-1">
              {courseData?.short_description}
            </p>
          </div>
          <div className="text-sm secondaryText flex items-center gap-2 capitalize">
            <span>{t("by")} :</span>
            <span>{courseData?.author_name}</span>
          </div>
          {
            courseData?.course_type && courseData?.course_type !== 'free' ? (
              <>
                <hr className="w-[120%] -ml-6 borderColor" />
                <div className="flex items-center relative gap-1 justify-between">

                  {courseData?.discount_price && courseData.discount_price > 0 ? (
                    <>
                      <div className="flex items-center gap-1">
                        <span className="text-xl md:text-2xl font-semibold">
                          {getCurrencySymbol()}{courseData.discount_price.toFixed(2)}
                        </span>
                        <span className=" secondaryText line-through">
                          {getCurrencySymbol()}{courseData.price.toFixed(2)}
                        </span>
                      </div>
                      {courseData.discount_percentage > 0 && (
                        <div className="flex items-center gap-1 text-[#DB3D26] text-sm font-medium">
                          <RiDiscountPercentFill />
                          <span>{courseData.discount_percentage}% off</span>
                        </div>
                      )}
                    </>
                  ) : (
                    // If discount_price is zero or doesn't exist, show only the regular price
                    <div className="flex items-center gap-1">
                      <span className="text-xl md:text-2xl font-semibold">
                        {getCurrencySymbol()}{courseData.price.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <hr className="w-[120%] -ml-6 borderColor" />
                <div className="flex items-center justify-between">
                  <span className="text-xl md:text-2xl font-semibold text-green-600">
                    {t("free")}
                  </span>
                </div>
              </>
            )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
