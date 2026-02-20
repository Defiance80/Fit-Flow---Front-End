import axiosClient from "../../axiosClient";
import { ApiResponse, PaginatedData } from "@/types/instructorTypes/instructorTypes";

// Interface for wishlist course data structure
export interface WishlistCourse {
    id: number;
    slug: string;
    image: string;
    category_id: number;
    category_name: string;
    course_type: 'free' | 'paid';
    level: 'beginner' | 'intermediate' | 'advanced';
    ratings: number;
    average_rating: number;
    title: string;
    short_description: string;
    author_name: string;
    price: number;
    discounted_price: number;
    discount_percentage: number;
    is_wishlisted: boolean;
    is_enrolled: boolean;
}


// Interface for query parameters
export interface GetWishlistParams {
    page?: number;
    per_page?: number;
    search?: string;
    course_type?: 'free' | 'paid';
    level?: 'beginner' | 'intermediate' | 'advanced';
    category_id?: number;
    sort_by?: 'title' | 'price' | 'average_rating' | 'created_at';
    sort_order?: 'asc' | 'desc';
    min_price?: number;
    max_price?: number;
    is_enrolled?: boolean;
}

// Use the common ApiResponse interface for consistent response handling
export type GetWishlistResponse = ApiResponse<PaginatedData<WishlistCourse>>;

/**
 * Fetch wishlist courses from the API with optional filtering parameters
 * @param params - Optional query parameters for filtering wishlist courses
 * @returns Promise with wishlist response or null
 */
export const getWishlist = async (params: GetWishlistParams = {}): Promise<GetWishlistResponse | null> => {
  try {
    // Extract query parameters
    const { ...queryParams } = params;

    const response = await axiosClient.get<GetWishlistResponse>("/wishlist", {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as { response?: { data?: GetWishlistResponse } };
    console.log("Error in getWishlist:", axiosError?.response?.data);
    if (axiosError?.response?.data) {
      return axiosError.response.data;
    }
    return null;
  }
};