// Define the option interface for email validation
export interface CheckEmailOptions {
  domains?: string | string[]; // Optional parameter for domain restrictions
  max?: number; // Maximum number of characters allowed in email extension
};

// Define the return property of validation
export interface ValidationResult {
  valid: boolean; // Indicates if email is valid or not
  error?: string | null; // Error message for invalid email or domain
};
