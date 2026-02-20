import axiosClient from "../../../../axiosClient";

// Interface for question answer data structure - matches the API request
export interface PostQuestionAnswerData {
  question_id: number;
  reply: string;
}

// Interface for the API response data structure
export interface PostQuestionAnswerResponseData {
  id: number;
  question_id: number;
  user_id: number;
  reply: string;
  created_at: string;
  updated_at: string;
}

// Interface for the actual API response structure
export interface PostQuestionAnswerApiResponse {
  error: boolean;
  message: string;
  data: PostQuestionAnswerResponseData;
  code: number;
}

// Standardized response structure for consistent error handling
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  message: string | null;
  code?: number;
}

/**
 * Post a question answer/reply to the helpdesk API
 * @param answerData - The answer data to post (question_id and reply)
 * @returns Promise with standardized API response structure
 */
export const postQuestionAnswer = async (
  answerData: PostQuestionAnswerData,
): Promise<ApiResponse<PostQuestionAnswerApiResponse>> => {
  try {
    // Get API URL from environment variables
    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = process.env.NEXT_PUBLIC_END_POINT;
    
    if (!baseURL || !endpoint) {
      return {
        success: false,
        data: null,
        error: "API configuration missing: NEXT_PUBLIC_API_URL or NEXT_PUBLIC_END_POINT",
        message: "Configuration error",
        code: 500
      };
    }

    // Validate required fields
    if (!answerData.question_id) {
      return {
        success: false,
        data: null,
        error: "Question ID is required",
        message: "Question ID field is required",
        code: 400
      };
    }

    if (!answerData.reply || answerData.reply.trim() === '') {
      return {
        success: false,
        data: null,
        error: "Reply content is required",
        message: "Reply field is required and cannot be empty",
        code: 400
      };
    }

    // Build the API URL for posting question answer
    const apiUrl = `/helpdesk/question/reply`;

    // Prepare the request data
    const requestData = {
      question_id: answerData.question_id,
      reply: answerData.reply.trim()
    };

    // Send the POST request to the backend API
    // Set Content-Type to application/json since we're sending JSON data, not FormData
    const response = await axiosClient(apiUrl, {
      method: 'POST',
      data: requestData,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if the API response indicates an error
    if (response.data.error) {
      return {
        success: false,
        data: response.data,
        error: response.data.message || "API returned an error",
        message: response.data.message,
        code: response.data.code
      };
    }

    // Return successful response
    return {
      success: true,
      data: response.data,
      error: null,
      message: response.data.message,
      code: response.data.code
    };

  } catch (error: unknown) {
    // Type cast error to access properties
    const err = error as {
      message: string;
      response?: {
        data: unknown;
        status: number;
      };
      config?: {
        url: string;
        method: string;
        timeout: number;
      };
    };

    // Improved error logging
    console.error("Post Question Answer API Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      config: {
        url: err.config?.url,
        method: err.config?.method,
        timeout: err.config?.timeout,
      },
    });

    // Return standardized error response
    return {
      success: false,
      data: null,
      error: err.message || "An unexpected error occurred",
      message: (err.response?.data as { message?: string })?.message || "Failed to post question answer",
      code: err.response?.status || 500
    };
  }
}