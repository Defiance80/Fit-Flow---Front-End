"use server"
import { cookies } from "next/headers";

/**
 * Get the authentication token from cookies
 * @returns Promise<string | null> - The auth token or null if not found
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('auth_token')?.value || null;
  } catch (error) {
    console.error('Error getting auth token from cookies:', error);
    return null;
  }
};

/**
 * Set the authentication token in cookies
 * @param token - The authentication token to store
 * @returns Promise<void>
 */
export const setAuthToken = async (token: string): Promise<void> => {
  try {
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true, // Prevents JavaScript access for security
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // Protects against CSRF attacks
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/', // Available across the entire app
    });
  } catch (error) {
    console.error('Error setting auth token in cookies:', error);
  }
};

/**
 * Remove the authentication token from cookies
 * @returns Promise<void>
 */
export const removeAuthToken = async (): Promise<void> => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
  } catch (error) {
    console.error('Error removing auth token from cookies:', error);
  }
};

/**
 * Check if user is authenticated by verifying token exists
 * @returns Promise<boolean> - True if authenticated, false otherwise
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getAuthToken();
  return token !== null;
};