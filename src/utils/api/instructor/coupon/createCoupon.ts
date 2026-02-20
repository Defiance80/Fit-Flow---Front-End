import axiosClient from "../../axiosClient";

// Interface for coupon creation form data structure
export interface CouponCreationFormData {
  promo_code: string;
  message: string;
  start_date: string;
  end_date: string;
  discount: number;
  // no_of_users: number;
  no_of_users: number;
  course_ids: number[];
}

// Interface for API response structure (matches backend response)
interface CouponCreationApiResponse {
  error: boolean;
  message: string;
  details?: string;
  code?: number;
  data?: Record<string, string | number>;
}

// Response structure with success field for backward compatibility
export interface CreateCouponResponse {
  success: boolean;
  data: CouponCreationApiResponse | null;
  error: string | null;
  message: string | null;
  code?: number;
}

/**
 * Create coupon with form data
 * @param couponData - Object containing coupon creation details
 * @returns Promise with coupon creation response
 */
export const createCouponWithData = async (
  couponData: CouponCreationFormData,
): Promise<CreateCouponResponse> => {
  try {
    // Create FormData object for the POST request
    const formData = new FormData();

    // Add required parameters to FormData
    formData.append("promo_code", couponData.promo_code);
    formData.append("message", couponData.message);
    formData.append("start_date", couponData.start_date);
    formData.append("end_date", couponData.end_date);
    formData.append("no_of_users", couponData.no_of_users.toString());
    formData.append("discount", couponData.discount.toString());
    formData.append("discount_type", "percentage");

    // Handle course_ids array - append each course ID
    if (couponData.course_ids && couponData.course_ids.length > 0) {
      couponData.course_ids.forEach((courseId) => {
        formData.append("course_ids[]", courseId.toString());
      });
    }

    // Send the POST request to the backend API with FormData
    const response = await axiosClient.post<CouponCreationApiResponse>("/add-promo-code", formData);

    // Check if the API response indicates an error
    if (response.data.error) {
      return {
        success: false,
        data: response.data,
        error: response.data.message || "Coupon creation failed",
        message: response.data.message || "Coupon creation failed",
        code: response.data.code || 400,
      };
    }

    // Return successful response
    return {
      success: true,
      data: response.data,
      error: null,
      message: response.data.message || "Coupon created successfully",
      code: response.data.code || 200,
    };

  } catch (error) {
    // Handle both HTTP errors (422, 500, etc.) and network errors
    const axiosError = error as { response?: { data?: CouponCreationApiResponse; status?: number } };
    console.log("Error in createCouponWithData:", axiosError?.response?.data);

    // If it's an HTTP error with response data, return the API error response
    if (axiosError?.response?.data) {
      return {
        success: false,
        data: axiosError.response.data,
        error: axiosError.response.data.message || "Coupon creation failed",
        message: axiosError.response.data.message || "Coupon creation failed",
        code: axiosError.response.data.code || axiosError.response.status || 400,
      };
    }

    // If it's a network error (no response), return error response
    return {
      success: false,
      data: null,
      error: "Network error occurred",
      message: "Failed to create coupon",
      code: 500,
    };
  }
};