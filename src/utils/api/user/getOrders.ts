import axiosClient from "../axiosClient";
import { ApiResponse } from "@/types/instructorTypes/instructorTypes";

// Interface for course data within an order
export interface OrderCourse {
  course_id: number;
  title: string;
  image: string;
  price: string;
  course_type: string;
  refund_enabled: boolean; 
  refund_period_days: number; 
  is_refund_eligible: boolean;
  refund_days_remaining: number;
  has_refund_request: boolean; 
  refund_request_status: string | null;
  refund_request_id: number | null;
  refund_admin_notes: string | null;
  purchase_date: string; 
  creator_name: string;
}

// Interface for applied promo codes
export interface AppliedPromoCode {
  code: string;
  discount_amount: number;
  discount_type: string;
}

// Interface for a single order
export interface Order {
  order_id: number;
  order_number: string;
  status: string;
  total_price: string;
  tax_price: string;
  total_discount: number;
  final_total: number;
  payment_method: string; 
  transaction_date: string;   
  transaction_date_formatted: string; 
  transaction_date_human: string; 
  courses: OrderCourse[];
  promo_code: AppliedPromoCode | null; 
  created_at?: string; 
  updated_at?: string; 
}

// Use the common ApiResponse interface for consistent response handling
export type GetOrdersResponse = ApiResponse<Order[]>;

/**
 * Fetch user orders from the API
 * @returns Promise with orders response or null
 */
export const getOrders = async (): Promise<GetOrdersResponse | null> => {
  try {
    const response = await axiosClient.get<GetOrdersResponse>("/orders");
    return response.data;
  } catch (error) {
    const axiosError = error as { response?: { data?: GetOrdersResponse } };
    console.log("Error in getOrders:", axiosError?.response?.data);
    if (axiosError?.response?.data) {
      return axiosError.response.data;
    }
    return null;
  }
};
