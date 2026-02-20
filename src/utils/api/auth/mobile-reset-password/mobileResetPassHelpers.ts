import { ApiResponse, MobileResetPasswordApiResponse, MobileResetPasswordResponse, MobileResetPasswordRequest } from './mobileResetPassword';

/**
 * Helper function to extract reset password data from API response
 * @param response - The API response from mobileResetPassword
 * @returns Reset password data object or null if error
 */
export const extractResetPasswordData = (response: ApiResponse<MobileResetPasswordApiResponse>): MobileResetPasswordResponse | null => {
    if (response.success && response.data?.data) {
        return response.data.data;
    }
    return null;
};

/**
 * Helper function to extract error message from API response
 * @param response - The API response from mobileResetPassword
 * @returns Error message string
 */
export const extractErrorMessage = (response: ApiResponse<MobileResetPasswordApiResponse>): string => {
    return response.message || response.data?.message || 'Password reset failed. Please try again.';
};

/**
 * Helper function to check if API response is successful
 * @param response - The API response from mobileResetPassword
 * @returns Boolean indicating if response is successful
 */
export const isMobileResetPasswordResponseSuccess = (response: ApiResponse<MobileResetPasswordApiResponse>): boolean => {
    return response.success && !!response.data;
};

/**
 * Helper function to get specific reset password value safely
 * @param response - The API response from mobileResetPassword
 * @param key - The reset password key to extract
 * @returns The reset password value or null if not found
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getResetPasswordValue = (response: ApiResponse<MobileResetPasswordApiResponse>, key: keyof MobileResetPasswordResponse): any => {
    if (isMobileResetPasswordResponseSuccess(response) && response.data?.data) {
        return response.data.data[key];
    }
    return null;
};

/**
 * Helper function to check if password reset was successful
 * @param response - The API response from mobileResetPassword
 * @returns Boolean indicating if password reset was successful
 */
export const isPasswordResetSuccessful = (response: ApiResponse<MobileResetPasswordApiResponse>): boolean => {
    return getResetPasswordValue(response, 'success') === true;
};

/**
 * Helper function to get reset password message
 * @param response - The API response from mobileResetPassword
 * @returns Reset password message or null if not found
 */
export const getResetPasswordMessage = (response: ApiResponse<MobileResetPasswordApiResponse>): string | null => {
    return getResetPasswordValue(response, 'message') || null;
};

/**
 * Helper function to validate mobile reset password request data
 * @param resetData - The mobile reset password request data
 * @returns Object with validation result and error message
 */
export const validateMobileResetPasswordData = (resetData: MobileResetPasswordRequest) => {
    const errors: string[] = [];

    // Check required fields
    if (!resetData.firebase_token || resetData.firebase_token.trim() === '') {
        errors.push('Firebase token is required');
    }

    if (!resetData.password || resetData.password.trim() === '') {
        errors.push('Password is required');
    }

    if (!resetData.confirm_password || resetData.confirm_password.trim() === '') {
        errors.push('Confirm password is required');
    }

    // Validate password strength
    if (resetData.password && !isValidPassword(resetData.password)) {
        errors.push('Password must be at least 6 characters long');
    }

    // Validate password match
    if (resetData.password && resetData.confirm_password && resetData.password !== resetData.confirm_password) {
        errors.push('Password and confirm password must match');
    }

    // Validate firebase token format (basic validation)
    if (resetData.firebase_token && !isValidFirebaseToken(resetData.firebase_token)) {
        errors.push('Please provide a valid firebase token');
    }

    return {
        isValid: errors.length === 0,
        errors: errors,
        errorMessage: errors.join(', ')
    };
};

/**
 * Helper function to validate firebase token format
 * @param token - Firebase token string to validate
 * @returns Boolean indicating if firebase token is valid
 */
export const isValidFirebaseToken = (token: string): boolean => {
    // Basic validation for firebase token (should be a non-empty string)
    return token.length > 0 && token.trim() !== '';
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
 * Helper function to validate password strength with additional criteria
 * @param password - Password string to validate
 * @returns Object with validation result and suggestions
 */
export const validatePasswordStrength = (password: string) => {
    const criteria = {
        length: password.length >= 6,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumbers: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(criteria).filter(Boolean).length;
    let strength = 'weak';
    let suggestions: string[] = [];

    if (score < 3) {
        strength = 'weak';
        suggestions = [
            'Use at least 6 characters',
            'Include uppercase letters',
            'Include lowercase letters',
            'Include numbers',
            'Include special characters'
        ];
    } else if (score < 4) {
        strength = 'medium';
        suggestions = [
            'Include numbers',
            'Include special characters'
        ];
    } else {
        strength = 'strong';
    }

    return {
        isValid: criteria.length,
        strength,
        score,
        criteria,
        suggestions
    };
};

/**
 * Helper function to check if passwords match
 * @param password - Password string
 * @param confirmPassword - Confirm password string
 * @returns Boolean indicating if passwords match
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
};

/**
 * Helper function to check if reset password can proceed
 * @param response - The API response from mobileResetPassword
 * @returns Object with reset status and any blocking issues
 */
export const checkResetPasswordStatus = (response: ApiResponse<MobileResetPasswordApiResponse>) => {
    if (!isMobileResetPasswordResponseSuccess(response)) {
        return {
            canProceed: false,
            reason: 'Reset password failed',
            message: extractErrorMessage(response)
        };
    }

    const resetData = extractResetPasswordData(response);
    if (!resetData) {
        return {
            canProceed: false,
            reason: 'No reset data received',
            message: 'Reset password response is invalid'
        };
    }

    if (!isPasswordResetSuccessful(response)) {
        return {
            canProceed: false,
            reason: 'Reset unsuccessful',
            message: getResetPasswordMessage(response) || 'Password reset was not successful'
        };
    }

    return {
        canProceed: true,
        reason: 'Reset successful',
        message: getResetPasswordMessage(response) || 'Password reset successful'
    };
};

/**
 * Helper function to generate password strength indicator
 * @param password - Password string to analyze
 * @returns Object with strength indicator and color
 */
export const getPasswordStrengthIndicator = (password: string) => {
    const strength = validatePasswordStrength(password);
    
    const indicators = {
        weak: { color: 'red', text: 'Weak' },
        medium: { color: 'orange', text: 'Medium' },
        strong: { color: 'green', text: 'Strong' }
    };

    return {
        ...indicators[strength.strength as keyof typeof indicators],
        score: strength.score,
        maxScore: 5
    };
};

/*
USAGE EXAMPLES:

1. Basic mobile reset password with error handling:
```typescript
import { mobileResetPassword } from './mobileResetPassword';
import { isMobileResetPasswordResponseSuccess, extractResetPasswordData, extractErrorMessage } from './mobileResetPassHelpers';

const resetData = {
  firebase_token: 'your-firebase-token',
  password: 'newpassword123',
  confirm_password: 'newpassword123'
};

const response = await mobileResetPassword(resetData);

if (isMobileResetPasswordResponseSuccess(response)) {
  const resetResult = extractResetPasswordData(response);
  if (resetResult) {
    console.log('Reset message:', resetResult.message);
    console.log('Reset successful:', resetResult.success);
  }
} else {
  const errorMessage = extractErrorMessage(response);
  toast.error(errorMessage);
}
```

2. With loading states:
```typescript
const [isLoading, setIsLoading] = useState(false);
const [resetResult, setResetResult] = useState<MobileResetPasswordResponse | null>(null);

const handleResetPassword = async (resetData: MobileResetPasswordRequest) => {
  setIsLoading(true);
  try {
    const response = await mobileResetPassword(resetData);
    
    if (isMobileResetPasswordResponseSuccess(response)) {
      const data = extractResetPasswordData(response);
      if (data) {
        setResetResult(data);
        toast.success('Password reset successful!');
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

3. Data validation before reset:
```typescript
const resetData = {
  firebase_token: 'your-firebase-token',
  password: 'newpassword123',
  confirm_password: 'newpassword123'
};

const validation = validateMobileResetPasswordData(resetData);

if (validation.isValid) {
  const response = await mobileResetPassword(resetData);
  // Handle response
} else {
  toast.error(validation.errorMessage);
}
```

4. Getting specific reset data:
```typescript
const response = await mobileResetPassword(resetData);

const resetMessage = getResetPasswordValue(response, 'message');
const isSuccessful = getResetPasswordValue(response, 'success');

if (resetMessage) {
  console.log('Reset message:', resetMessage);
}

if (isSuccessful) {
  console.log('Password reset was successful');
}
```

5. Checking reset status:
```typescript
const response = await mobileResetPassword(resetData);

if (isPasswordResetSuccessful(response)) {
  console.log('Password reset was successful');
} else {
  console.log('Password reset failed');
}

const message = getResetPasswordMessage(response);
if (message) {
  console.log('Reset message:', message);
}
```

6. Complete reset password flow with validation:
```typescript
const handleCompleteResetPassword = async (formData: MobileResetPasswordRequest) => {
  // Validate data first
  const validation = validateMobileResetPasswordData(formData);
  
  if (!validation.isValid) {
    toast.error(validation.errorMessage);
    return;
  }

  // Show loading state
  setIsLoading(true);

  try {
    const response = await mobileResetPassword(formData);
    
    // Check reset status
    const resetStatus = checkResetPasswordStatus(response);
    
    if (resetStatus.canProceed) {
      const resetData = extractResetPasswordData(response);
      
      if (resetData) {
        // Show success message
        toast.success('Password reset successful!');
        
        // Redirect to login page
        router.push('/login');
      }
    } else {
      toast.error(resetStatus.message);
    }
  } catch (error) {
    toast.error('An unexpected error occurred');
  } finally {
    setIsLoading(false);
  }
};
```

7. Password strength validation:
```typescript
const password = 'MyPassword123!';
const strength = validatePasswordStrength(password);

console.log('Password strength:', strength.strength);
console.log('Strength score:', strength.score);
console.log('Suggestions:', strength.suggestions);

// Get strength indicator for UI
const indicator = getPasswordStrengthIndicator(password);
console.log('Indicator color:', indicator.color);
console.log('Indicator text:', indicator.text);
```

8. Password matching validation:
```typescript
const password = 'newpassword123';
const confirmPassword = 'newpassword123';

if (doPasswordsMatch(password, confirmPassword)) {
  console.log('Passwords match');
} else {
  console.log('Passwords do not match');
}
```

9. Firebase token validation:
```typescript
const token = 'your-firebase-token';

if (isValidFirebaseToken(token)) {
  console.log('Firebase token is valid');
} else {
  console.log('Firebase token is invalid');
}
```

10. Password validation examples:
```typescript
// Valid passwords
console.log(isValidPassword('password123')); // true
console.log(isValidPassword('123456')); // true

// Invalid passwords
console.log(isValidPassword('12345')); // false (too short)

// Password strength examples
const weakPassword = '123';
const mediumPassword = 'password123';
const strongPassword = 'MyPassword123!';

console.log(validatePasswordStrength(weakPassword).strength); // 'weak'
console.log(validatePasswordStrength(mediumPassword).strength); // 'medium'
console.log(validatePasswordStrength(strongPassword).strength); // 'strong'
```

11. Complete form validation example:
```typescript
const handleFormValidation = (formData: MobileResetPasswordRequest) => {
  // Basic validation
  const validation = validateMobileResetPasswordData(formData);
  
  if (!validation.isValid) {
    return { isValid: false, message: validation.errorMessage };
  }

  // Password strength validation
  const strength = validatePasswordStrength(formData.password);
  
  if (strength.strength === 'weak') {
    return { 
      isValid: false, 
      message: 'Password is too weak. ' + strength.suggestions.join(', ')
    };
  }

  // Password match validation
  if (!doPasswordsMatch(formData.password, formData.confirm_password)) {
    return { isValid: false, message: 'Passwords do not match' };
  }

  return { isValid: true, message: 'All validations passed' };
};
```

12. UI integration example:
```typescript
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [strengthIndicator, setStrengthIndicator] = useState(null);

const handlePasswordChange = (newPassword: string) => {
  setPassword(newPassword);
  const indicator = getPasswordStrengthIndicator(newPassword);
  setStrengthIndicator(indicator);
};

// In your JSX
<div>
  <input 
    type="password" 
    value={password} 
    onChange={(e) => handlePasswordChange(e.target.value)}
  />
  {strengthIndicator && (
    <div style={{ color: strengthIndicator.color }}>
      {strengthIndicator.text} ({strengthIndicator.score}/{strengthIndicator.maxScore})
    </div>
  )}
</div>
```
*/ 