"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Import usePathname
import { useState } from "react"; // Import useState
import { BiEditAlt, BiReceipt } from "react-icons/bi";
import { FaRegBookmark } from "react-icons/fa";
import {
  LuLock,
  LuGraduationCap,
  LuBell,
  LuTrash2,
  LuLogOut,
  LuWallet,
} from "react-icons/lu"; // Using Lucide icons as an example
import LogoutModal from "./LogoutModal"; // Import the LogoutModal component
import { useTranslation } from '@/hooks/useTranslation';
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "@/redux/reducers/userSlice";
import toast from "react-hot-toast";
import { resetTeamMemberData } from "@/redux/instructorReducers/teamMemberSlice";

// Define the type for a sidebar item
type SidebarItem = {
  href: string;
  icon: React.ElementType;
  label: string;
  action?: () => void; // Optional action for items like logout
};

// Array will be defined inside the component where t function is available

export default function ProfileSidebar() {

  const { t } = useTranslation();
  const auth = getAuth()
  const dispatch = useDispatch();
  const pathname = usePathname(); // Get the current path
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State for logout modal

  // Array of sidebar items (moved inside component to access t function)
  const sidebarItems: SidebarItem[] = [
    { href: "/edit-profile", icon: BiEditAlt, label: t("edit_profile") },
    { href: "/account-security", icon: LuLock, label: t("account_security") },
    { href: "/my-learnings", icon: LuGraduationCap, label: t("my_learnings") },
    { href: "/my-wishlist", icon: FaRegBookmark, label: t("my_wishlist") },
    { href: "/notifications", icon: LuBell, label: t("notifications") },
    {
      href: "/transaction-history",
      icon: BiReceipt,
      label: t("my_purchases"),
    },
    { href: "/my-wallet", icon: LuWallet, label: t("my_wallet") },
    { href: "/delete-account", icon: LuTrash2, label: t("delete_account") },
  ];
  // Function to open the logout modal
  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  // Function to close the logout modal
  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await new Promise((resolve, reject) => {
        signOut(auth)
          .then(() => {
            dispatch(logoutSuccess())
            dispatch(resetTeamMemberData())
            if (typeof window !== 'undefined') {
              window.recaptchaVerifier = null
            }
            closeLogoutModal();
            toast.success(t("logout_successfully"))
            router.push('/')
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

  // Function to handle the confirmed logout action
  const handleLogoutConfirm = () => {
    handleSignOut()
  };

  // Define the logout item separately as it needs a button/action
  const logoutItem: SidebarItem = {
    href: "#", // Not a real link, just a placeholder or identifier
    icon: LuLogOut,
    label: t("log_out"),
    action: openLogoutModal, // Set the action to open the modal
  };

  return (
    <div className="bg-white rounded-[10px] p-2 md:p-4 min-w-[100%] md:min-w-[350px] h-fit">
      <ul className="space-y-2">
        {[...sidebarItems, logoutItem].map((item) => {
          // Add logoutItem to the mapped array
          const isActive = pathname === item.href && item.href !== "#"; // Check active state, ignoring the logout placeholder href

          // Common classes for list items
          const itemClasses = `flex items-center gap-3 p-3 rounded-[5px] transition-colors duration-200 w-full text-left`; // Ensure buttons take full width and text is aligned left

          // Conditional styling for active vs inactive items
          const activeClasses =
            "bg-[#5A5BB512] primaryColor relative before:absolute before:content-[''] before:w-1 before:h-full before:bg-[var(--primary-color)] before:left-0 before:rounded-l-[5px] font-medium bg-opacity-70";
          const inactiveClasses = "text-gray-700 hover:bg-gray-100";

          return (
            <li key={item.label}>
              {" "}
              {/* Use label as key for uniqueness, especially for logout */}
              {item.action ? (
                // If item has an action (like logout), render a button
                <button
                  onClick={item.action}
                  className={`${itemClasses} ${inactiveClasses}`} // Logout is never "active" in the same way as a page link
                  title={item.label}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ) : (
                // Otherwise, render a Link for navigation
                <Link
                  href={item.href}
                  className={`${itemClasses} ${isActive ? activeClasses : inactiveClasses
                    }`}
                  title={item.label}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
      {/* Render the LogoutModal conditionally */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={closeLogoutModal}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}
