import axiosClient from "../axiosClient";
import { PaginatedData } from "@/types/instructorTypes/instructorTypes";

// Interface for category data structure - matches the actual API response
export interface CategoryItem {
  id: number;
  name: string;
  image: string;
  parent_category_id: null;
  description: string | null;
  status: boolean;
  slug: string;
  subcategories_count: number;
  parent_category_count: number;
  courses_count: number;
  has_subcategory: boolean;
  has_parent_category: boolean;
  // Optional subcategories array for when fetching subcategories
  subcategories?: SubCategoryItem[];
}

// Interface for subcategory data structure - matches SubCategoriesDataType from types.tsx
export interface SubCategoryItem {
  id: number;
  sequence: null;
  name: string;
  image: string;
  parent_category_id: number;
  description: null;
  status: boolean;
  slug: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  has_subcategory: boolean;
  has_parent_category: boolean;
}

// Use the common PaginatedData interface with CategoryItem
export type CategoriesPaginatedData = PaginatedData<CategoryItem>;

// Interface for the actual API response structure
export interface CategoriesResponse {
  error: boolean;
  message: string;
  data: CategoriesPaginatedData;
  code: number;
}

// Interface for query parameters
export interface GetCategoriesParams {
  id?: number;
  slug?: string;
  per_page?: number;
  page?: number | null;
  get_parent_category?: number;
  get_subcategory?: number;
}

/**
 * Fetch categories from the API with optional filtering parameters
 * @param params - Optional query parameters for filtering categories
 * @returns Promise with API response structure containing categories
 */
export const getCategories = async (params: GetCategoriesParams = {}): Promise<CategoriesResponse | null> => {
  try {
    // Build query parameters object, filtering out undefined values
    const queryParams: Record<string, string | number> = {};

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        // Only add parameters that are not undefined
        if (value !== undefined && value !== null) {
          queryParams[key] = value;
        }
      });
    }

    // Send the GET request to the backend API with query parameters
    const response = await axiosClient.get<CategoriesResponse>("/categories", {
      params: queryParams, // Pass query parameters
    });

    // Always return the response data, even if error: true
    // This allows the component to handle API errors properly
    return response.data;
  } catch (error) {
    // Handle both HTTP errors (422, 500, etc.) and network errors
    const axiosError = error as { response?: { data?: CategoriesResponse } };
    console.log("Error in getCategories:", axiosError?.response?.data);

    // If it's an HTTP error with response data, return the API error response
    if (axiosError?.response?.data) {
      return axiosError.response.data;
    }

    // If it's a network error (no response), return null
    return null;
  }
}