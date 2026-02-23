import { StoreProvider } from "@/redux/store/StoreProvider";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
// Import Swiper styles
// Make sure to add these imports in your _app.tsx or specific page
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import 'react-quill-new/dist/quill.snow.css';
import { Toaster } from "react-hot-toast";
import PushNotificationLayout from "@/components/firebaseNotification/PushNotification";


const geist = Geist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_TITLE,
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  keywords: process.env.NEXT_PUBLIC_kEYWORDS,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-version={process.env.NEXT_PUBLIC_WEB_VERSION}>
      <body className={`${geist.variable} font-sans !pointer-events-auto`} suppressHydrationWarning>
        <StoreProvider>
          <Toaster position="top-center" toastOptions={{
            style: {
              background: "#000",
              color: "#fff",
            },
          }} />
          <PushNotificationLayout>
            {children}
          </PushNotificationLayout>
        </StoreProvider>
      </body>
    </html>
  );
}
