import { PostQuestionAnswerApiResponse, ApiResponse } from "./postQuestionAnswer";

/**
 * Check if the API response indicates a successful question answer post
 * @param response - The API response to check
 * @returns boolean indicating if the response is successful
 */
export const isPostQuestionAnswerResponseSuccess = (
  response: ApiResponse<PostQuestionAnswerApiResponse>
): boolean => {
  return response.success && response.data !== null && !response.data.error;
};

/**
 * Extract the question answer data from a successful API response
 * @param response - The successful API response
 * @returns The question answer data
 */
export const extractQuestionAnswerData = (
  response: ApiResponse<PostQuestionAnswerApiResponse>
) => {
  if (!response.data) {
    throw new Error("No data available in response");
  }
  return response.data.data;
};

/**
 * Extract error message from API response
 * @param response - The API response
 * @returns The error message
 */
export const extractErrorMessage = (
  response: ApiResponse<PostQuestionAnswerApiResponse>
): string => {
  if (response.error) {
    return response.error;
  }
  if (response.data?.message) {
    return response.data.message;
  }
  return "An unexpected error occurred";
};
