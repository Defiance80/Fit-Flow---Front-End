import { ApiResponse, UserExistsApiResponse, UserExistsResponse, UserExistsRequest } from './userExistsApi';

/**
 * Helper function to extract user exists data from API response
 * @param response - The API response from userExists
 * @returns User exists data object or null if error
 */
export const extractUserExistsData = (response: ApiResponse<UserExistsApiResponse>): UserExistsResponse | null => {
    if (response.success && response.data?.data) {
        return response.data.data;
    }
    return null;
};

/**
 * Helper function to extract error message from API response
 * @param response - The API response from userExists
 * @returns Error message string
 */
export const extractErrorMessage = (response: ApiResponse<UserExistsApiResponse>): string => {
    return response.message || response.data?.message || 'Something went wrong';
};

/**
 * Helper function to check if API response is successful
 * @param response - The API response from userExists
 * @returns Boolean indicating if response is successful
 */
export const isUserExistsResponseSuccess = (response: ApiResponse<UserExistsApiResponse>): boolean => {
    return response.success && !!response.data;
};

/**
 * Helper function to check if user is new (doesn't exist)
 * @param response - The API response from userExists
 * @returns Boolean indicating if user is new
 */
export const isNewUser = (response: ApiResponse<UserExistsApiResponse>): boolean => {
    if (isUserExistsResponseSuccess(response) && response.data?.data) {
        return response.data.data.is_new_user;
    }
    return false;
};

/**
 * Helper function to check if user exists (is not new)
 * @param response - The API response from userExists
 * @returns Boolean indicating if user exists
 */
export const doesUserExist = (response: ApiResponse<UserExistsApiResponse>): boolean => {
    if (isUserExistsResponseSuccess(response) && response.data?.data) {
        return !response.data.data.is_new_user;
    }
    return false;
};

/**
 * Helper function to get specific user exists value safely
 * @param response - The API response from userExists
 * @param key - The user exists key to extract
 * @returns The user exists value or null if not found
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUserExistsValue = (response: ApiResponse<UserExistsApiResponse>, key: keyof UserExistsResponse): any => {
    if (isUserExistsResponseSuccess(response) && response.data?.data) {
        return response.data.data[key];
    }
    return null;
};

/**
 * Helper function to validate user exists request data
 * @param existsData - The user exists request data
 * @returns Object with validation result and error message
 */
export const validateUserExistsData = (existsData: UserExistsRequest) => {
    const errors: string[] = [];

    // Check if either email or mobile is provided
    if (!existsData.email && !existsData.mobile) {
        errors.push('Either email or mobile number is required');
    }

    // Validate email format if provided
    if (existsData.email && !isValidEmail(existsData.email)) {
        errors.push('Please provide a valid email address');
    }

    // Validate mobile format if provided
    if (existsData.mobile && !isValidMobile(existsData.mobile)) {
        errors.push('Please provide a valid mobile number');
    }

    return {
        isValid: errors.length === 0,
        errors: errors,
        errorMessage: errors.join(', ')
    };
};

/**
 * Helper function to validate email format
 * @param email - Email string to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Helper function to validate mobile number format
 * @param mobile - Mobile number string to validate
 * @returns Boolean indicating if mobile number is valid
 */
export const isValidMobile = (mobile: string): boolean => {
    const mobileRegex = /^[0-9]{10,15}$/;
    return mobileRegex.test(mobile.replace(/\s/g, ''));
};

/*
USAGE EXAMPLES:

1. Basic usage with error handling:
```typescript
import { userExists } from './userExistsApi';
import { isUserExistsResponseSuccess, extractUserExistsData, extractErrorMessage } from './userExistsHelpers';

const existsData = {
  email: 'john@example.com'
};

const response = await userExists(existsData);

if (isUserExistsResponseSuccess(response)) {
  const existsData = extractUserExistsData(response);
  if (existsData) {
    if (existsData.exists) {
      console.log('User exists:', existsData.user);
    } else {
      console.log('User does not exist');
    }
  }
} else {
  const errorMessage = extractErrorMessage(response);
  toast.error(errorMessage);
}
```

2. Checking by mobile number:
```typescript
const existsData = {
  mobile: '1234567890',
  country_code: '+1'
};

const response = await userExists(existsData);

if (isUserExistsResponseSuccess(response)) {
  if (doesUserExist(response)) {
    const userData = getUserData(response);
    if (userData) {
      console.log('User found:', userData.name);
      console.log('User email:', userData.email);
    }
  } else {
    console.log('User not found');
  }
} else {
  const errorMessage = extractErrorMessage(response);
  toast.error(errorMessage);
}
```

3. With loading states:
```typescript
const [isLoading, setIsLoading] = useState(false);
const [userExists, setUserExists] = useState<boolean | null>(null);

const checkUserExists = async (email: string) => {
  setIsLoading(true);
  try {
    const response = await userExists({ email });
    
    if (isUserExistsResponseSuccess(response)) {
      const exists = doesUserExist(response);
      setUserExists(exists);
      
      if (exists) {
        const userData = getUserData(response);
        console.log('User data:', userData);
      }
    } else {
      const errorMessage = extractErrorMessage(response);
      toast.error(errorMessage);
    }
  } catch (error) {
    toast.error('An unexpected error occurred');
  } finally {
    setIsLoading(false);
  }
};
```

4. Data validation before check:
```typescript
const existsData = {
  email: 'john@example.com'
};

const validation = validateUserExistsData(existsData);

if (validation.isValid) {
  const response = await userExists(existsData);
  // Handle response
} else {
  toast.error(validation.errorMessage);
}
```

5. Getting specific data:
```typescript
const response = await userExists({ email: 'john@example.com' });

const exists = getUserExistsValue(response, 'exists');
const message = getUserExistsValue(response, 'message');

if (exists) {
  console.log('User exists:', message);
} else {
  console.log('User does not exist:', message);
}
```

6. Complete user check flow:
```typescript
const handleUserCheck = async (email: string, mobile?: string) => {
  // Validate data first
  const validation = validateUserExistsData({ email, mobile });
  
  if (!validation.isValid) {
    toast.error(validation.errorMessage);
    return;
  }

  // Show loading state
  setIsLoading(true);

  try {
    const response = await userExists({ email, mobile });
    
    if (isUserExistsResponseSuccess(response)) {
      if (doesUserExist(response)) {
        const userData = getUserData(response);
        
        if (userData) {
          // User exists - show login options
          setUserExists(true);
          setExistingUserData(userData);
          showLoginOptions();
        }
      } else {
        // User doesn't exist - show signup options
        setUserExists(false);
        showSignupOptions();
      }
    } else {
      const errorMessage = extractErrorMessage(response);
      toast.error(errorMessage);
    }
  } catch (error) {
    toast.error('An unexpected error occurred');
  } finally {
    setIsLoading(false);
  }
};
```

7. Checking before registration:
```typescript
const checkBeforeSignup = async (email: string, mobile?: string) => {
  const response = await userExists({ email, mobile });
  
  if (isUserExistsResponseSuccess(response)) {
    if (doesUserExist(response)) {
      // User already exists - redirect to login
      toast.error('User already exists. Please login instead.');
      router.push('/login');
    } else {
      // User doesn't exist - proceed with signup
      proceedWithSignup();
    }
  } else {
    const errorMessage = extractErrorMessage(response);
    toast.error(errorMessage);
  }
};
```

8. Email availability check:
```typescript
const checkEmailAvailability = async (email: string) => {
  const response = await userExists({ email });
  
  if (isUserExistsResponseSuccess(response)) {
    const exists = doesUserExist(response);
    
    if (exists) {
      setEmailAvailable(false);
      setEmailError('This email is already registered');
    } else {
      setEmailAvailable(true);
      setEmailError('');
    }
  } else {
    const errorMessage = extractErrorMessage(response);
    setEmailError(errorMessage);
  }
};
```

9. Mobile availability check:
```typescript
const checkMobileAvailability = async (mobile: string, countryCode: string) => {
  const response = await userExists({ 
    mobile, 
    country_code: countryCode 
  });
  
  if (isUserExistsResponseSuccess(response)) {
    const exists = doesUserExist(response);
    
    if (exists) {
      setMobileAvailable(false);
      setMobileError('This mobile number is already registered');
    } else {
      setMobileAvailable(true);
      setMobileError('');
    }
  } else {
    const errorMessage = extractErrorMessage(response);
    setMobileError(errorMessage);
  }
};
```

10. Form validation with real-time checks:
```typescript
const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
const [mobileAvailable, setMobileAvailable] = useState<boolean | null>(null);

const validateForm = async (email: string, mobile?: string) => {
  // Check email availability
  if (email) {
    const emailResponse = await userExists({ email });
    if (isUserExistsResponseSuccess(emailResponse)) {
      setEmailAvailable(!doesUserExist(emailResponse));
    }
  }

  // Check mobile availability
  if (mobile) {
    const mobileResponse = await userExists({ mobile });
    if (isUserExistsResponseSuccess(mobileResponse)) {
      setMobileAvailable(!doesUserExist(mobileResponse));
    }
  }

  // Return overall validation result
  return emailAvailable && mobileAvailable;
};
```
*/ 