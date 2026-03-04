import { Metadata } from "next";
import DownloadContent from "./DownloadContent";

export const metadata: Metadata = {
  title: "Download Fit Flow — Your Fitness, One App",
  description:
    "Download the Fit Flow app to connect with your trainer, track your health metrics, follow personalized programs, and see your progress — all in one place.",
  openGraph: {
    title: "Download Fit Flow — Your Fitness, One App",
    description:
      "Connect with your trainer, track your health, follow your programs, and see your progress — all in one place.",
    url: "https://fitflow.shopbluewolf.com/download",
    siteName: "Fit Flow",
    type: "website",
    images: [{ url: "/fitflow-logo.png", width: 512, height: 512, alt: "Fit Flow Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download Fit Flow — Your Fitness, One App",
    description: "Your fitness journey in one powerful app.",
    images: ["/fitflow-logo.png"],
  },
};

export default function DownloadPage() {
  return <DownloadContent />;
}
