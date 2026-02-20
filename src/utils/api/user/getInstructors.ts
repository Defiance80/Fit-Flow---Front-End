import axiosClient from "../axiosClient";
import { ApiResponse, PaginatedData } from "@/types/instructorTypes/instructorTypes";
import { SocialMediaItem } from "../general/getSettings";


// Interface for instructors data structure
export interface InstructorData {
  id: number;
  user_id: number;
  type: 'individual' | 'team';
  status: 'pending' | 'approved' | 'rejected';
  name: string;
  email: string;
  slug: string;
  profile: string;
  qualification: string;
  years_of_experience: number;
  skills: string;
  about_me: string;
  preview_video: string;
  team_name: string;
  social_medias: SocialMediaItem[];
  average_rating: number;
  total_ratings: number;
  student_enrolled_count: number;
  active_courses_count: number;
  published_courses_count: number;
  rating: string;
  user_purchased_course: boolean;
}


// Interface for query parameters
export interface GetInstructorsParams {
  page?: number;
  per_page?: number;
  search?: string;
  type?: 'individual' | 'team';
  status?: 'pending' | 'approved' | 'rejected';
  sort_by?: 'name' | 'average_rating' | 'total_ratings' | 'active_courses_count' | 'published_courses_count' | 'years_of_experience';
  sort_order?: 'asc' | 'desc';
  min_rating?: number;
  min_courses?: number;
  skills?: string;
  slug?: string;
  // Filter parameters for instructor filtering
  level?: string;
  language?: string;
  duration?: number;
  price?: string;
  rating?: string;
  category?: string;
  category_slug?: string; // Added support for category slug filtering
}

// Use the common ApiResponse interface for consistent response handling
export type GetInstructorsResponse = ApiResponse<PaginatedData<InstructorData>>;

/**
 * Fetch instructors from the API with optional filtering parameters
 * @param params - Parameters for fetching instructors (page, per_page, search, type, status, sort_by, sort_order, min_rating, min_courses, skills, slug, level, language, duration, price, rating, category, category_slug)
 * @returns Promise with instructors response or null
 */
export const getInstructors = async (params: GetInstructorsParams = {}): Promise<GetInstructorsResponse | null> => {
  try {
    // Extract query parameters
    const { ...queryParams } = params;

    const response = await axiosClient.get<GetInstructorsResponse>("/get-instructors", {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as { response?: { data?: GetInstructorsResponse } };
    console.log("Error in getInstructors:", axiosError?.response?.data);
    if (axiosError?.response?.data) {
      return axiosError.response.data;
    }
    return null;
  }
};