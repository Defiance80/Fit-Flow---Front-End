'use client'
import React, { useState } from 'react'
import { RiEdit2Line } from "react-icons/ri";
import { BiBookAlt, BiLogOut } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { FaRegCreditCard } from "react-icons/fa";
import { BsCart3, BsBookmark, BsBell } from "react-icons/bs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useSelector, useDispatch } from 'react-redux';
import { logoutSuccess, userDataSelector } from '@/redux/reducers/userSlice';
import { IoCaretDownSharp } from 'react-icons/io5';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import CustomImageTag from '../commonComp/customImage/CustomImageTag';
import { LuBook, LuPencil } from 'react-icons/lu';
import { LuTrendingUp } from 'react-icons/lu';
import { TbDashboard } from 'react-icons/tb';
import { useTranslation } from '@/hooks/useTranslation';
import { UserDetails } from '@/utils/api/user/getUserDetails';
import { resetTeamMemberData } from '@/redux/instructorReducers/teamMemberSlice';
import { currentLanguageSelector } from '@/redux/reducers/languageSlice';


const ProfileDropdown = ({ isMobileNav, isInstructor }: { isMobileNav?: boolean, isInstructor?: boolean }) => {

    const userData = useSelector(userDataSelector) as UserDetails
    const currentLanguageCode = useSelector(currentLanguageSelector)
    const router = useRouter()
    const dispatch = useDispatch()
    const { t } = useTranslation();
    const authentication = getAuth()

    const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false)
    const [logoutConfrm, setLogoutConfrm] = useState<boolean>(false)
    const [imageError, setImageError] = useState<boolean>(false)

    // Array of background colors for fallback avatar
    const avatarColors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-red-500',
        'bg-yellow-500',
        'bg-teal-500',
        'bg-orange-500',
        'bg-cyan-500'
    ];

    // Function to get initials from name
    const getInitials = (name: string): string => {
        if (!name) return 'U';

        const words = name.trim().split(' ');
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }

        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };

    // Function to get random color based on name
    const getAvatarColor = (name: string): string => {
        if (!name) return avatarColors[0];

        // Generate a consistent color based on name
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % avatarColors.length;
        return avatarColors[index];
    };

    // Fallback Avatar Component
    const FallbackAvatar = ({ name }: { name: string }) => {
        const initials = getInitials(name);
        const bgColor = getAvatarColor(name);

        return (
            <div
                className={`${bgColor} rounded-full flex items-center justify-center text-white font-semibold w-full h-full !p-0`}
            >
                {initials}
            </div>
        );
    };

    // Reset image error when user data changes
    React.useEffect(() => {
        setImageError(false);
    }, [userData?.profile]);

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
                        router.push(`/?lang=${currentLanguageCode}`)
                        setLogoutConfrm(false)
                        setIsProfileOpen(false)
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

    const handleAlert = async () => {
            setLogoutConfrm(true)
    }

    // Check if we should show fallback avatar
    const shouldShowFallback = !userData?.profile || imageError;

    return (
        <div className="relative">
            <>
                {
                    isInstructor ?
                        <DropdownMenu
                            open={isProfileOpen}
                            onOpenChange={setIsProfileOpen}
                        >
                            <DropdownMenuTrigger asChild >
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div className="h-12 w-12 rounded-full border borderColor p-1 flex items-center justify-center overflow-hidden">
                                        {shouldShowFallback ? (
                                            <FallbackAvatar name={userData?.name || 'User'} />
                                        ) : (
                                            <div className="h-12 w-12 !borderColor border rounded-full p-1 flexCenter">
                                                <CustomImageTag src={userData?.profile} alt={userData?.name} className="h-10 w-10 rounded-full" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="flex items-center gap-1">
                                        {userData?.name} <IoCaretDownSharp size={12} />
                                    </span>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-max py-2 !borderColor">
                                {/* User info with name and email */}
                                <div className="flex items-center px-4 py-2 gap-2">
                                    <div className="h-12 w-12 !borderColor border rounded-full p-1 flexCenter">
                                        <CustomImageTag src={userData?.profile} alt={userData?.name} className="h-10 w-10 rounded-full" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{userData?.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {userData?.email}
                                        </span>
                                    </div>
                                </div>

                                {/* Switch to Student button */}
                                <div className="px-2 py-2">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center hover:bg-black hover:text-white transition-all duration-300"
                                    >
                                        <Link href={`/?lang=${currentLanguageCode}`} title='Switch To Student'
                                            className="flexCenter gap-2"

                                        >
                                            {t("switch_to_student")}
                                        </Link>
                                    </Button>
                                </div>

                                <DropdownMenuSeparator className="mt-2" />


                                {/* Profile section */}
                                <div className="px-4 pt-2 pb-1 text-sm text-muted-foreground">
                                    {t("profile")}
                                </div>
                                <DropdownMenuItem
                                    onClick={() => setIsProfileOpen(false)}
                                    className="px-4 py-2 cursor-pointer hover:!primaryColor hover:!primaryLightBg focus:!primaryColor"
                                >
                                    <Link href={`/edit-profile?lang=${currentLanguageCode}`} title='Edit Profile' className='flexCenter gap-2'>
                                        <span className="text-gray-500">
                                            <LuPencil className="mr-2 h-4 w-4" />
                                        </span>
                                        {t("edit_profile")}
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                {/* Activities section */}
                                <div className="px-4 pt-2 pb-1 text-sm text-muted-foreground">
                                    {t("activities")}
                                </div>
                                <DropdownMenuItem
                                    onClick={() => setIsProfileOpen(false)}
                                    className="px-4 py-2 cursor-pointer hover:!primaryColor hover:!primaryLightBg focus:!primaryColor"
                                >
                                    <Link href={`/instructor/dashboard?lang=${currentLanguageCode}`} title='Dashboard' className='flexCenter gap-2'>
                                        <span className="text-gray-500">
                                            <TbDashboard className="mr-2 h-4 w-4" />
                                        </span>
                                        {t("dashboard")}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setIsProfileOpen(false)}
                                    className="px-4 py-2 cursor-pointer hover:!primaryColor hover:!primaryLightBg focus:!primaryColor"
                                >
                                    <Link href={`/instructor/my-course?lang=${currentLanguageCode}`} title='My Course' className='flexCenter gap-2'>
                                        <span className="text-gray-500">
                                            <LuBook className="mr-2 h-4 w-4" />
                                        </span>
                                        {t("my_course")}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setIsProfileOpen(false)}
                                    className="px-4 py-2 cursor-pointer hover:!primaryColor hover:!primaryLightBg focus:!primaryColor"
                                >
                                    <Link href={`/instructor/earnings?lang=${currentLanguageCode}`} title='Earnings' className='flexCenter gap-2'>
                                        <span className="text-gray-500">
                                            <LuTrendingUp className="mr-2 h-4 w-4" />
                                        </span>
                                        {t("earnings")}
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                {/* Log Out option */}
                                <DropdownMenuItem
                                    className="px-4 py-2 cursor-pointer hover:!primaryColor hover:!primaryLightBg focus:!primaryColor" onClick={() => handleAlert()}>
                                    <div className='flexCenter gap-2'>
                                        <span className="text-gray-500">
                                            <BiLogOut size={18} />
                                        </span>
                                        <span>{t("log_out")}</span>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        :
                        <DropdownMenu
                            open={isProfileOpen}
                            onOpenChange={setIsProfileOpen}
                        >
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div className="h-12 w-12 rounded-full border borderColor p-1 flex items-center justify-center overflow-hidden">
                                        {shouldShowFallback ? (
                                            <FallbackAvatar name={userData?.name || 'User'} />
                                        ) : (
                                            <div className="h-12 w-12 !borderColor border rounded-full p-1 flexCenter">
                                                <CustomImageTag src={userData?.profile} alt={userData?.name} className="h-10 w-10 rounded-full" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="flex items-center gap-1">
                                        {userData?.name} <IoCaretDownSharp size={12} />
                                    </span>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[250px] sm:w-[350px] max-h-[450px] overflow-y-auto sm:max-h-full  max-575:absolute max-575:top-12 mt-1 border-none shadow-lg"
                                align={isMobileNav ? 'start' : 'end'}
                                side={isMobileNav ? 'left' : 'bottom'}
                                onMouseLeave={() => setIsProfileOpen(false)}
                            >
                                <div className="p-4 flex items-center gap-3 border-b border-gray-200">
                                    <div className="h-12 w-12 rounded-full flex items-center justify-center overflow-hidden border borderColor p-1">
                                        {shouldShowFallback ? (
                                            <FallbackAvatar name={userData?.name || 'User'} />
                                        ) : (
                                            <CustomImageTag
                                                src={userData?.profile}
                                                alt={userData?.name}
                                                className="h-10 w-10 rounded-full"
                                            />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{userData?.name}</span>
                                        <span className="text-gray-500 text-sm break-all">
                                            {userData?.email}
                                        </span>
                                    </div>
                                </div>

                                <DropdownMenuLabel className="text-gray-500 text-sm px-4 py-2 font-normal">
                                    {t("instructor")}
                                </DropdownMenuLabel>
                                <DropdownMenuItem asChild
                                    onClick={() => setIsProfileOpen(false)} className="px-4 py-2 cursor-pointer hover:!primaryColor hover:!primaryLightBg focus:!primaryColor">
                                    {
                                        userData?.is_instructor ? userData?.instructor_process_status === 'approved' ?
                                            <Link href={`/instructor/dashboard?lang=${currentLanguageCode}`} title='Instructor Dashboard' className='flex items-center justify-start gap-2'>
                                                <span className="text-gray-500">
                                                    <FiUser size={18} />
                                                </span>
                                                <span>{t("switch_to_instructor")}</span>
                                            </Link> :
                                            <Link href={`/become-instructor/application?lang=${currentLanguageCode}`} title='Become An Instructor' className='flex items-center justify-start gap-2'>
                                                <span className="text-gray-500">
                                                    <FiUser size={18} />
                                                </span>
                                                <span>{t("become_an_instructor")}</span>
                                            </Link>
                                            :
                                            <Link href={`/become-instructor?lang=${currentLanguageCode}`} title='Become An Instructor' className='flex items-center justify-start gap-2'>
                                                <span className="text-gray-500">
                                                    <FiUser size={18} />
                                                </span>
                                                <span>{t("become_an_instructor")}</span>
                                            </Link>
                                    }

                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuLabel className="text-gray-500 text-sm px-4 py-2 font-normal">
                                    {t("profile")}
                                </DropdownMenuLabel>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild
                                        onClick={() => setIsProfileOpen(false)} className="px-4 py-2 cursor-pointer hover:!primaryColor hover:!primaryLightBg focus:!primaryColor">
                                        <Link href={`/edit-profile?lang=${currentLanguageCode}`} title='Edit Profile' className='flex items-center justify-start gap-2'>
                                            <span className="text-gray-500">
                                                <RiEdit2Line size={18} />
                                            </span>
                                            <span>{t("edit_profile")}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild
                                        onClick={() => setIsProfileOpen(false)} className="px-4 py-2 cursor-pointer hover:!primaryColor hover:!primaryLightBg focus:!primaryColor">
                                        <Link href={`/transaction-history?lang=${currentLanguageCode}`} title='Transaction History' className='flex items-center justify-start gap-2'>
                                            <span className="text-gray-500">
                                                <FaRegCreditCard size={18} />
                                            </span>
                                            <span>{t("transaction_history")}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>

                                <DropdownMenuSeparator />

                                <DropdownMenuLabel className="text-gray-500 text-sm px-4 py-2 font-normal">
                                    {t("activities")}
                                </DropdownMenuLabel>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild
                                        onClick={() => setIsProfileOpen(false)} className="px-4 py-2 cursor-pointer hover:!primaryColor hover:!primaryLightBg focus:!primaryColor">
                                        <Link href={`/my-learnings?lang=${currentLanguageCode}`} title='My Learnings' className='flex items-center justify-start gap-2'>
                                            <span className="text-gray-500">
                                                <BiBookAlt size={18} />
                                            </span>
                                            <span>{t("my_learnings")}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild
                                        onClick={() => setIsProfileOpen(false)} className="px-4 py-2 cursor-pointer hover:!primaryColor hover:!primaryLightBg focus:!primaryColor">
                                        <Link href={`/cart?lang=${currentLanguageCode}`} title='Cart' className='flex items-center justify-start gap-2'>
                                            <span className="text-gray-500">
                                                <BsCart3 size={18} />
                                            </span>
                                            <span>{t("my_cart")}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild
                                        onClick={() => setIsProfileOpen(false)} className="px-4 py-2 cursor-pointer hover:!primaryColor hover:!primaryLightBg focus:!primaryColor">
                                        <Link href={`/my-wishlist?lang=${currentLanguageCode}`} title='My Wishlist' className='flex items-center justify-start gap-2'>
                                            <span className="text-gray-500">
                                                <BsBookmark size={18} />
                                            </span>
                                            <span>{t("my_wishlist")}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild
                                        onClick={() => setIsProfileOpen(false)} className="px-4 py-2 cursor-pointer hover:!primaryColor hover:!primaryLightBg focus:!primaryColor">
                                        <Link href={`/notifications?lang=${currentLanguageCode}`} title='Notification' className='flex items-center justify-start gap-2'>
                                            <span className="text-gray-500">
                                                <BsBell size={18} />
                                            </span>
                                            <span>{t("notifications")}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem asChild   
                                    className="px-4 py-2 cursor-pointer hover:!primaryColor hover:!primaryLightBg focus:!primaryColor" onClick={() => handleAlert()}>
                                    <div className='flex items-center justify-start gap-2'>
                                        <span className="text-gray-500">
                                            <BiLogOut size={18} />
                                        </span>
                                        <span>{t("log_out")}</span>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                }
            </>
            <div>
                {/* logout alert */}
                <AlertDialog open={logoutConfrm} onOpenChange={setLogoutConfrm}>
                    <AlertDialogContent className='bg-white'>
                        <AlertDialogHeader>
                            <AlertDialogTitle className='hidden'></AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription className='text-center'>
                            {t("are_you_sure_you_want_to_log_out")}
                        </AlertDialogDescription>
                        <AlertDialogFooter className=''>
                            <AlertDialogAction className='primaryBg text-white' onClick={() => handleSignOut('logoutAcc')}>{t("yes")}</AlertDialogAction>
                            <AlertDialogCancel onClick={() => setLogoutConfrm(false)}>{t("cancel")}</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}

export default ProfileDropdown
