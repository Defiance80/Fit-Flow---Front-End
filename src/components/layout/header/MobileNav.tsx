"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { isLoginSelector } from "@/redux/reducers/userSlice";
import { AlignLeft } from "lucide-react";
import { FaAngleRight, FaRegUser } from "react-icons/fa6";
import CustomImageTag from "@/components/commonComp/customImage/CustomImageTag";
import ProfileSheet from "@/components/responsiveComponents/ProfileSheet";
import { FaAngleDown, FaAngleUp, FaCheck } from "react-icons/fa";
import { categoryDataSelector } from "@/redux/reducers/categorySlice";
import { CategoryDataType } from "@/types";
import { getAuth, signOut } from 'firebase/auth';
import { logoutSuccess } from '@/redux/reducers/userSlice';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import SubCatesSheet from "@/components/responsiveComponents/SuCatesSheet";
import { useTranslation } from '@/hooks/useTranslation';
import { resetTeamMemberData } from "@/redux/instructorReducers/teamMemberSlice";
import { currentLanguageSelector, languagesSelector, setCurrentTranslations, setCurrentLanguage, setIsRTL, setLanguageLastFetch } from "@/redux/reducers/languageSlice";
import { getLanguage } from "@/utils/api/language/getLanguages";
import { extractErrorMessage } from "@/utils/helpers";
import { settingsSelector } from "@/redux/reducers/settingsSlice";

interface MobileNavProps {
  openSignInModal: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ openSignInModal }) => {

  const { t } = useTranslation();
  const isLogin = useSelector(isLoginSelector);
  const [isOpen, setIsOpen] = useState(false);
  
  
  // Redux selectors - now using simplified selectors
  const settings = useSelector(settingsSelector);
  const logo = settings?.data?.horizontal_logo;
  const languages = useSelector(languagesSelector);
  const currentLanguage = useSelector(currentLanguageSelector);

  const currentLanguageCode = currentLanguage;
  
  const pathname = usePathname();
  // Local state for loading
  const [isLoadingLanguage, setIsLoadingLanguage] = useState(false);

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const categories = useSelector(categoryDataSelector);

  const navigate = useRouter()
  const dispatch = useDispatch()

  const authentication = getAuth()

  const [logoutConfrm, setLogoutConfrm] = useState<boolean>(false)

  /**
   * Calculate dynamic height for dropdown based on item count
   * @param itemCount - Number of items in the dropdown
   * @param itemHeight - Height of each item in pixels (default: 40px)
   * @param padding - Additional padding in pixels (default: 24px)
   * @param headerHeight - Height of dropdown header in pixels (default: 40px)
   * @returns Dynamic height in pixels
   */
  const calculateDropdownHeight = (
    itemCount: number,
    itemHeight: number = 40,
    padding: number = 24,
    headerHeight: number = 40
  ): number => {
    // Calculate total content height: header + items + padding
    const totalHeight = headerHeight + (itemCount * itemHeight) + padding;

    // Return the calculated height in pixels
    return totalHeight;
  };

  const handleSignOut = async (modal: string) => {
    try {
      await new Promise((resolve, reject) => {
        signOut(authentication)
          .then(() => {
            dispatch(logoutSuccess())
            dispatch(resetTeamMemberData())
            if (typeof window !== 'undefined') {
              window.recaptchaVerifier = null
            }
            toast.success(modal === 'deleteAcc' ? t("account_deleted_successfully") : t("logout_successfully"))
            navigate.push(`/?lang=${currentLanguageCode}`)
            setLogoutConfrm(false)
            resolve(void 0) // Resolve the promise when signOut is successful
          })
          .catch(error => {
            toast.error(error)
            reject(error) // Reject the promise if there's an error
          })
      })
    } catch (error) {
      console.log('Oops errors!', error)
    }
  }


  // Handle language change - following simplified pattern
  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode !== currentLanguage) {
      setIsLoadingLanguage(true);

      try {
        // Save to localStorage for persistence
        localStorage.setItem('selectedLanguage', languageCode);

        // Fetch specific language translations
        const response = await getLanguage({
          system_type: "web",
          code: languageCode // Pass specific language code
        });

        if (response && !response.error) {
          // Get the specific language data (should be only one language in response)
          const languageData = response.data?.languages?.[0];

          if (languageData && languageData.code === languageCode) {
            // Update Redux state with new language data
            dispatch(setCurrentLanguage(languageCode));
            dispatch(setCurrentTranslations(languageData.translations_web));
            dispatch(setIsRTL(languageData.is_rtl));
            dispatch(setLanguageLastFetch(Date.now()));
          } else {
            toast.error('Language not found in response');
          }
        } else {
          toast.error(response?.error || 'Failed to fetch language');
        }
      } catch (error) {
        extractErrorMessage(error);
        console.error('❌ Failed to change language:', error);
      } finally {
        setIsLoadingLanguage(false);
        // Close modal
        setIsOpen(false);
      }
    }
  };


  // Calculate heights for both dropdowns
  const languageDropdownHeight = calculateDropdownHeight(languages.length, 40, 24, 40);
  const categoryDropdownHeight = calculateDropdownHeight(categories?.length || 0, 40, 24, 64); // 64px for category header

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const handleCategoryClick = (id: number) => {
    setSelectedCategory(id)
  }

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <AlignLeft className="primaryColor" />
        </SheetTrigger>
        <SheetContent side="left" className="px-4">
          <SheetTitle className="pt-2 border-b borderColor">
            <div className="w-[112px] h-[48px] sm:w-[207px] sm:h-[64px] md:h-[80px] flex items-center">
              <Link href={`/?lang=${currentLanguageCode}`}>
                <CustomImageTag
                  src={logo}
                  alt="logo"
                  className="w-full h-full object-contain"
                />
              </Link>
            </div>
          </SheetTitle>
          <div className="flex items-center gap-4 flex-wrap">
            {
              isLogin ?
                <ProfileSheet setIsOpen={setIsOpen} />
                :
                <div className="flexCenter flex-col w-full gap-4 sm:border-l borderColor h-full py-3 sm:pl-6">
                  <button className="cursor-pointer" onClick={openSignInModal}>{t("sign_in")}</button>
                  <button className="bg-black rounded-[4px] py-2 px-4 text-white cursor-pointer w-full flexCenter gap-2" onClick={openSignInModal}>
                    <FaRegUser />
                    <span>
                      {t("register_now")}
                    </span>
                  </button>
                </div>
            }
          </div>
          <div className="pt-4 space-y-8">
            <ul className="flexColCenter justify-start items-start gap-6">
              <SheetClose
                asChild
                className="border-b borderColor pb-3"
              >
                <Link
                  href={`/?lang=${currentLanguageCode}`}
                  className={`flex items-center justify-between w-full transition-all duration-300 hover:primaryColor ${pathname === "/"
                    ? "border-b-[2px] font-semibold primaryColor !primaryBorder pb-1"
                    : "font-normal"
                    } px-2`}
                  title={t("home")}
                >
                  {t("home")}
                  <span className="flexCenter primaryBg text-white rounded-full w-[26px] h-[26px]">
                    <FaAngleRight />
                  </span>
                </Link>
              </SheetClose>

              <SheetClose
                asChild
                className="border-b borderColor pb-3"
              >
                <Link
                  href={`/courses?lang=${currentLanguageCode}`}
                  className={`flex items-center justify-between w-full transition-all duration-300 hover:primaryColor ${pathname === "/courses"
                    ? "border-b-[2px] font-semibold primaryColor !primaryBorder pb-1"
                    : "font-normal"
                    } px-2`}
                  title={t("courses")}
                >
                  {t("courses")}
                  <span className="flexCenter primaryBg text-white rounded-full w-[26px] h-[26px]">
                    <FaAngleRight />
                  </span>
                </Link>
              </SheetClose>

              <SheetClose
                asChild
                className="border-b borderColor pb-3"
              >
                <Link
                  href={`/instructors?lang=${currentLanguageCode}`}
                  className={`flex items-center justify-between w-full transition-all duration-300 hover:primaryColor ${pathname === "/instructors"
                    ? "border-b-[2px] font-semibold primaryColor !primaryBorder pb-1"
                    : "font-normal"
                    } px-2`}
                  title={t("instructor")}
                >
                  {t("instructor")}
                  <span className="flexCenter primaryBg text-white rounded-full w-[26px] h-[26px]">
                    <FaAngleRight />
                  </span>
                </Link>
              </SheetClose>

              <SheetClose
                asChild
                className="border-b borderColor pb-3"
              >
                <Link
                  href={`/help-support?lang=${currentLanguageCode}`}
                  className={`flex items-center justify-between w-full transition-all duration-300 hover:primaryColor ${pathname === "/help-support"
                    ? "border-b-[2px] font-semibold primaryColor !primaryBorder pb-1"
                    : "font-normal"
                    } px-2`}
                  title={t("help_support")}
                >
                  {t("help_support")}
                  <span className="flexCenter primaryBg text-white rounded-full w-[26px] h-[26px]">
                    <FaAngleRight />
                  </span>
                </Link>
              </SheetClose>
              {isLogin && (
                <SheetClose
                  asChild
                  className="border-b borderColor pb-3"
                >
                  <Link
                    href={`/notifications?lang=${currentLanguageCode}`}
                    className={`flex items-center justify-between w-full transition-all duration-300 hover:primaryColor ${pathname === "/notifications"
                      ? "border-b-[2px] font-semibold primaryColor !primaryBorder pb-1"
                      : "font-normal"
                      } px-2`}
                    title={t("notification")}
                  >
                    {t("notification")}
                    <span className="flexCenter primaryBg text-white rounded-full w-[26px] h-[26px]">
                      <FaAngleRight />
                    </span>
                  </Link>
                </SheetClose>
              )}
              {/* language dropdown */}
              <div
                className={`border-b borderColor pb-3 cursor-pointer w-full space-y-6 transition-all duration-500 overflow-hidden`}
                style={{
                  height: isLangDropdownOpen ? `${languageDropdownHeight}px` : "40px",
                }}
              >
                <div
                  className={`flex items-center justify-between w-full transition-all duration-300 hover:primaryColor px-2`}
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                >
                  <span>{t("english_us")}</span>
                  <span className="flexCenter primaryBg text-white rounded-full w-[26px] h-[26px]">
                    {
                      isLangDropdownOpen ?
                        <FaAngleUp />
                        :
                        <FaAngleDown />
                    }
                  </span>
                </div>
                <div className="flex flex-col gap-3 pl-4">
                  {languages.map((language) => (
                    <div
                      className={`flex items-center justify-between w-full transition-all duration-300 hover:primaryColor px-2 ${language.code === currentLanguage ? "primaryColor" : ""}`}
                      key={language.code}
                      onClick={() => !isLoadingLanguage && handleLanguageChange(language.code)}
                    >
                      <span>{language.name}</span>
                      {
                        language.code === currentLanguage &&
                        <span className="flexCenter primaryBg text-white rounded-full w-[20px] h-[20px] p-1">
                          <FaCheck />
                        </span>
                      }
                    </div>
                  ))}
                </div>
              </div>

              {/* category dropdown */}
              <div
                className={`cursor-pointer w-full space-y-6 transition-all duration-500 overflow-hidden`}
                style={{
                  height: isCategoryDropdownOpen ? `${categoryDropdownHeight}px` : "50px",
                }}
              >
                <div
                  className={`primaryLightBg primaryColor flexCenter flex items-center justify-between w-full transition-all duration-300 hover:primaryColor p-3 rounded-[8px]`}
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                >
                  <span>{t("category")}</span>
                  <span className="flexCenter primaryBg text-white rounded-full w-[26px] h-[26px]">
                    {
                      isCategoryDropdownOpen ?
                        <FaAngleUp />
                        :
                        <FaAngleDown />
                    }
                  </span>
                </div>
                <div className="flex flex-col gap-4 px-4">
                  {categories?.map((category: CategoryDataType) => (
                    <div
                      className={`flex items-center justify-between w-full transition-all duration-300 hover:primaryColor px-2 ${category.id === 1 ? "" : ""}`}
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <Link href={`/courses/${category.slug}?lang=${currentLanguageCode}`}>
                        <span>{category.name}</span>
                      </Link>
                      {
                        category.has_subcategory &&
                        // <span className="flexCenter rounded-full w-[20px] h-[20px] p-1">
                        //   <FaAngleRight className="text-gray-600 text-sm" />
                        // </span>
                        <div className="">
                          <SubCatesSheet
                            selectedCategory={selectedCategory}
                            categoryId={category.id}
                            setIsOpen={setIsOpen}
                          />
                        </div>
                      }
                    </div>
                  ))}
                </div>
              </div>

              {/* logout */}
              {
                isLogin &&
                <div className="flex items-center gap-2 py-2 font-medium cursor-pointer text-red-500 hover:!primaryColor pl-2" onClick={() => setLogoutConfrm(true)}>
                  <div className='flexCenter gap-2'>
                    <span>{t("log_out")}</span>
                  </div>
                </div>
              }
            </ul>
          </div>
        </SheetContent>
      </Sheet>
      {/* logout alert */}
      <AlertDialog open={logoutConfrm} onOpenChange={setLogoutConfrm}>
        <AlertDialogContent className='bg-white'>
          <AlertDialogHeader>
            <AlertDialogTitle className='hidden'></AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {t("are_you_sure_you_want_to_log_out")}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction className='primaryBg text-white' onClick={() => handleSignOut('logoutAcc')}>{t("yes")}</AlertDialogAction>
            <AlertDialogCancel onClick={() => setLogoutConfrm(false)}>{t("cancel")}</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MobileNav;
