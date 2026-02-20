import { ApiResponse, MobileLoginApiResponse, MobileLoginResponse, MobileLoginRequest } from './mobileLogin';

/**
 * Helper function to extract user login data from API response
 * @param response - The API response from mobileLogin
 * @returns User login data object or null if error
 */
export const extractUserLoginData = (response: ApiResponse<MobileLoginApiResponse>): MobileLoginResponse | null => {
    if (response.success && response.data?.data) {
        return response.data.data;
    }
    return null;
};

/**
 * Helper function to extract error message from API response
 * @param response - The API response from mobileLogin
 * @returns Error message string
 */
export const extractErrorMessage = (response: ApiResponse<MobileLoginApiResponse>): string => {
    return response.message || response.data?.message || 'Login failed. Please try again.';
};

/**
 * Helper function to check if API response is successful
 * @param response - The API response from mobileLogin
 * @returns Boolean indicating if response is successful
 */
export const isMobileLoginResponseSuccess = (response: ApiResponse<MobileLoginApiResponse>): boolean => {
    return response.success && !!response.data;
};

/**
 * Helper function to get specific user login value safely
 * @param response - The API response from mobileLogin
 * @param key - The user login key to extract
 * @returns The user login value or null if not found
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUserLoginValue = (response: ApiResponse<MobileLoginApiResponse>, key: keyof MobileLoginResponse): any => {
    if (isMobileLoginResponseSuccess(response) && response.data?.data) {
        return response.data.data[key];
    }
    return null;
};

/**
 * Helper function to check if user is active
 * @param response - The API response from mobileLogin
 * @returns Boolean indicating if user is active
 */
export const isUserActive = (response: ApiResponse<MobileLoginApiResponse>): boolean => {
    return getUserLoginValue(response, 'is_active') === true;
};

/**
 * Helper function to check if user email is verified
 * @param response - The API response from mobileLogin
 * @returns Boolean indicating if user email is verified
 */
export const isEmailVerified = (response: ApiResponse<MobileLoginApiResponse>): boolean => {
    return getUserLoginValue(response, 'email_verified_at') !== null;
};

/**
 * Helper function to check if user mobile is verified
 * @param response - The API response from mobileLogin
 * @returns Boolean indicating if user mobile is verified
 */
export const isMobileVerified = (response: ApiResponse<MobileLoginApiResponse>): boolean => {
    return getUserLoginValue(response, 'mobile_verified_at') !== null;
};

/**
 * Helper function to get user authentication token
 * @param response - The API response from mobileLogin
 * @returns Authentication token or null if not found
 */
export const getAuthToken = (response: ApiResponse<MobileLoginApiResponse>): string | null => {
    return getUserLoginValue(response, 'token') || null;
};

/**
 * Helper function to get user basic info from login response
 * @param response - The API response from mobileLogin
 * @returns Object with basic user information
 */
export const getUserBasicInfo = (response: ApiResponse<MobileLoginApiResponse>) => {
    if (isMobileLoginResponseSuccess(response) && response.data?.data) {
        const user = response.data.data;
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            country_code: user.country_code,
            profile: user.profile,
            type: user.type,
        };
    }
    return null;
};

/**
 * Helper function to get user verification status
 * @param response - The API response from mobileLogin
 * @returns Object with user verification status
 */
export const getUserVerificationStatus = (response: ApiResponse<MobileLoginApiResponse>) => {
    if (isMobileLoginResponseSuccess(response) && response.data?.data) {
        const user = response.data.data;
        return {
            email_verified: user.email_verified_at !== null,
            mobile_verified: user.mobile_verified_at !== null,
            email_verified_at: user.email_verified_at,
            mobile_verified_at: user.mobile_verified_at,
        };
    }
    return null;
};

/**
 * Helper function to validate mobile login request data
 * @param loginData - The mobile login request data
 * @returns Object with validation result and error message
 */
export const validateMobileLoginData = (loginData: MobileLoginRequest) => {
    const errors: string[] = [];

    // Check required fields
    if (!loginData.country_code || loginData.country_code.trim() === '') {
        errors.push('Country code is required');
    }

    if (!loginData.mobile || loginData.mobile.trim() === '') {
        errors.push('Mobile number is required');
    }

    if (!loginData.password || loginData.password.trim() === '') {
        errors.push('Password is required');
    }

    // Validate country code format
    if (loginData.country_code && !isValidCountryCode(loginData.country_code)) {
        errors.push('Please provide a valid country code (e.g., +1, +44, +91)');
    }

    // Validate mobile format if provided
    if (loginData.mobile && !isValidMobile(loginData.mobile)) {
        errors.push('Please provide a valid mobile number');
    }

    // Validate password strength
    if (loginData.password && !isValidPassword(loginData.password)) {
        errors.push('Password must be at least 6 characters long');
    }

    return {
        isValid: errors.length === 0,
        errors: errors,
        errorMessage: errors.join(', ')
    };
};

/**
 * Helper function to validate country code format
 * @param countryCode - Country code string to validate
 * @returns Boolean indicating if country code is valid
 */
export const isValidCountryCode = (countryCode: string): boolean => {
    const countryCodeRegex = /^\+[1-9]\d{0,3}$/;
    return countryCodeRegex.test(countryCode);
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

/**
 * Helper function to validate password strength
 * @param password - Password string to validate
 * @returns Boolean indicating if password is valid
 */
export const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
};

/**
 * Helper function to format mobile number for display
 * @param mobile - Mobile number string
 * @param countryCode - Country code string
 * @returns Formatted mobile number
 */
export const formatMobileNumber = (mobile: string, countryCode: string): string => {
    return `${countryCode} ${mobile}`;
};

/**
 * Helper function to check if user can proceed with login
 * @param response - The API response from mobileLogin
 * @returns Object with login status and any blocking issues
 */
export const checkLoginStatus = (response: ApiResponse<MobileLoginApiResponse>) => {
    if (!isMobileLoginResponseSuccess(response)) {
        return {
            canProceed: false,
            reason: 'Login failed',
            message: extractErrorMessage(response)
        };
    }

    const userData = extractUserLoginData(response);
    if (!userData) {
        return {
            canProceed: false,
            reason: 'No user data received',
            message: 'Login response is invalid'
        };
    }

    if (!isUserActive(response)) {
        return {
            canProceed: false,
            reason: 'Account inactive',
            message: 'Your account is not active. Please contact support.'
        };
    }

    return {
        canProceed: true,
        reason: 'Login successful',
        message: 'Login successful'
    };
};

/*
USAGE EXAMPLES:

1. Basic mobile login with error handling:
```typescript
import { mobileLogin } from './mobileLogin';
import { isMobileLoginResponseSuccess, extractUserLoginData, extractErrorMessage } from './mobileLoginHelpers';

const loginData = {
  country_code: '+1',
  mobile: '1234567890',
  password: 'password123',
  fcm_id: 'optional-fcm-id'
};

const response = await mobileLogin(loginData);

if (isMobileLoginResponseSuccess(response)) {
  const userData = extractUserLoginData(response);
  if (userData) {
    // Use user data
    console.log('User ID:', userData.id);
    console.log('User name:', userData.name);
    console.log('Token:', userData.token);
  }
} else {
  const errorMessage = extractErrorMessage(response);
  toast.error(errorMessage);
}
```

2. With loading states:
```typescript
const [isLoading, setIsLoading] = useState(false);
const [userData, setUserData] = useState<MobileLoginResponse | null>(null);

const handleLogin = async (loginData: MobileLoginRequest) => {
  setIsLoading(true);
  try {
    const response = await mobileLogin(loginData);
    
    if (isMobileLoginResponseSuccess(response)) {
      const data = extractUserLoginData(response);
      if (data) {
        setUserData(data);
        // Store token in localStorage or Redux
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
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

3. Data validation before login:
```typescript
const loginData = {
  country_code: '+1',
  mobile: '1234567890',
  password: 'password123'
};

const validation = validateMobileLoginData(loginData);

if (validation.isValid) {
  const response = await mobileLogin(loginData);
  // Handle response
} else {
  toast.error(validation.errorMessage);
}
```

4. Getting specific user data:
```typescript
const response = await mobileLogin(loginData);

const userName = getUserLoginValue(response, 'name');
const userEmail = getUserLoginValue(response, 'email');
const isActive = getUserLoginValue(response, 'is_active');

if (userName) {
  console.log('Welcome back,', userName);
}

if (isActive) {
  console.log('Account is active');
}
```

5. Checking user status:
```typescript
const response = await mobileLogin(loginData);

if (isUserActive(response)) {
  console.log('User account is active');
} else {
  console.log('User account is inactive');
}

if (isEmailVerified(response)) {
  console.log('Email is verified');
} else {
  console.log('Email is not verified');
}

if (isMobileVerified(response)) {
  console.log('Mobile is verified');
} else {
  console.log('Mobile is not verified');
}
```

6. Getting authentication token:
```typescript
const response = await mobileLogin(loginData);

const token = getAuthToken(response);
if (token) {
  // Store token for future API calls
  localStorage.setItem('authToken', token);
  // Set authorization header for axios
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} else {
  console.log('No token received');
}
```

7. Getting user basic info:
```typescript
const response = await mobileLogin(loginData);

const basicInfo = getUserBasicInfo(response);
if (basicInfo) {
  console.log('User ID:', basicInfo.id);
  console.log('User name:', basicInfo.name);
  console.log('User email:', basicInfo.email);
  console.log('User mobile:', basicInfo.mobile);
  console.log('Profile image:', basicInfo.profile);
}
```

8. Getting verification status:
```typescript
const response = await mobileLogin(loginData);

const verificationStatus = getUserVerificationStatus(response);
if (verificationStatus) {
  if (verificationStatus.email_verified) {
    console.log('Email is verified');
  } else {
    console.log('Email is not verified');
  }
  
  if (verificationStatus.mobile_verified) {
    console.log('Mobile is verified');
  } else {
    console.log('Mobile is not verified');
  }
}
```

9. Complete login flow with validation:
```typescript
const handleCompleteLogin = async (formData: MobileLoginRequest) => {
  // Validate data first
  const validation = validateMobileLoginData(formData);
  
  if (!validation.isValid) {
    toast.error(validation.errorMessage);
    return;
  }

  // Show loading state
  setIsLoading(true);

  try {
    const response = await mobileLogin(formData);
    
    // Check login status
    const loginStatus = checkLoginStatus(response);
    
    if (loginStatus.canProceed) {
      const userData = extractUserLoginData(response);
      
      if (userData) {
        // Store user data
        setUserData(userData);
        
        // Store token
        if (userData.token) {
          localStorage.setItem('authToken', userData.token);
        }
        
        // Show success message
        toast.success('Login successful!');
        
        // Redirect to dashboard
        router.push('/dashboard');
      }
    } else {
      toast.error(loginStatus.message);
    }
  } catch (error) {
    toast.error('An unexpected error occurred');
  } finally {
    setIsLoading(false);
  }
};
```

10. Formatting mobile number for display:
```typescript
const formattedMobile = formatMobileNumber('1234567890', '+1');
console.log(formattedMobile); // Output: +1 1234567890
```

11. Validation examples:
```typescript
// Valid country codes
console.log(isValidCountryCode('+1')); // true
console.log(isValidCountryCode('+44')); // true
console.log(isValidCountryCode('+91')); // true
console.log(isValidCountryCode('+1234')); // true

// Invalid country codes
console.log(isValidCountryCode('1')); // false (missing +)
console.log(isValidCountryCode('+0')); // false (starts with 0)
console.log(isValidCountryCode('+12345')); // false (too long)

// Valid mobile numbers
console.log(isValidMobile('1234567890')); // true
console.log(isValidMobile('123456789012345')); // true

// Invalid mobile numbers
console.log(isValidMobile('123456789')); // false (too short)
console.log(isValidMobile('1234567890123456')); // false (too long)

// Valid passwords
console.log(isValidPassword('password123')); // true
console.log(isValidPassword('123456')); // true

// Invalid passwords
console.log(isValidPassword('12345')); // false (too short)
```
*/ 