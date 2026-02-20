import axiosClient from "../axiosClient";
import { ApiResponse } from "@/types/instructorTypes/instructorTypes";

// Interface for payment gateway settings
// Supports multiple payment gateways: razorpay, stripe, flutterwave
export interface PaymentGateway {
  payment_gateway: string;
}

// Interface for social media item
export interface SocialMediaItem {
  id: number;
  name: string;
  icon: string;
  url?: string;
  title?: string; // Optional, not always present in API response
}

// Interface for web settings data structure based on actual API response
export interface WebSettings {
  system_color: string;
  currency_code: string;
  currency_symbol: string;
  tax_type: string;
  active_payment_settings: PaymentGateway[];
  individual_instructor_terms: string;
  team_instructor_terms: string;
  app_name: string;
  website_url: string;
  announcement_bar: string;
  favicon: string;
  vertical_logo: string;
  horizontal_logo: string;
  placeholder_image: string;
  playstore_url: string | null; // Android app store link
  appstore_url: string | null; // iOS app store link
  contact_address: string;
  contact_email: string;
  contact_phone: string;
  schema: string;
  maintaince_mode: string; // "0" or "1" for maintenance mode status
  hover_color: string;
  footer_description: string;
  system_light_colour: string;
  social_media: SocialMediaItem[];
  // App-related settings for mobile app deep linking (kept for backward compatibility)
  web_name?: string; // Company/website name
  android_app_link?: string; // Alias for playstore_url (backward compatibility)
  ios_app_link?: string; // Alias for appstore_url (backward compatibility)
}

// Use the common ApiResponse interface for consistent response handling
export type GetSettingsResponse = ApiResponse<WebSettings>;

/**
 * Fetch web settings from the API
 * @returns Promise with web settings response or null
 */
export const getSettings = async (): Promise<GetSettingsResponse | null> => {
  try {
    const response = await axiosClient.get<GetSettingsResponse>("/web-settings");
    return response.data;
  } catch (error) {
    const axiosError = error as { response?: { data?: GetSettingsResponse } };
    console.log("Error in getSettings:", axiosError?.response?.data);
    if (axiosError?.response?.data) {
      return axiosError.response.data;
    }
    return null;
  }
};