/**
 * @description - A module that validates email addresses with an optional domain restriction.
 * @version 1.0.0
 * @author Ken Ryan Labso
 * @license MIT
 */

import { CheckEmailOptions, ValidationResult } from './interface';

const DOMAIN_REGEX = /^\w+\.[a-zA-Z]{2,}$/; // Regular expression for validating domain format
const EMAIL_WITH_DOMAIN_REGEX = (name: string, extension: string) => new RegExp(`^\\w+([.-]?\\w+)*@${name}\\.${extension}$`); // Regular expression pattern for email validation with domain

/**
 * @function getResponse
 * @description - Generate object response for the email validation
 * @param valid - A boolean for valid and invalid email
 * @param email - Email to be validated
 * @param error - Optional message to replace the generic error message
 * @returns An object: { valid: boolean; error?: string | null; }
 */
function getResponse(valid: boolean, email: string | null = null, error: string | null = null): ValidationResult {
  // Return response for valid email
  if (valid) return { valid };

  // Return with error message only if email is invalid
  const message = error || `${email} is not a valid email.`;
  return {
    valid,
    error: !valid ? message : null,
  }
};

/**
 * @function validateDomains
 * @description - Validate if domains provided are valid
 * @param domains - Array of string to be validated with email for domain restrictions
 * @returns An object: { valid: boolean; error?: string | null; }
 */
function validateDomains(domains: string[]): ValidationResult {
  const errors: string[] = [];

  // Validate if domains are in valid format
  domains.forEach(domain => {
    if (!DOMAIN_REGEX.test(domain)) errors.push(domain);
  });

  // Check for errors then only include it in the return if it has invalid domains
  const hasErrors = errors.length > 0;
  const message = hasErrors ? `[${errors.join(', ')}] are not valid domains.` : null;

  return getResponse(!hasErrors, null, message);
};

/**
 * @function checkEmail
 * @description - Validates if email is valid based on provided options
 * @param email - The email to be validated
 * @param options - An optional object with validation options: { domains?: string | string[]; max?: number; }
 * @returns An object: { valid: boolean; error?: string | null; }
 */
function checkEmail(email: string, options: CheckEmailOptions = {}): ValidationResult {
  const { domains, max = null } = options; // Destructure options object

  if (max && typeof max !== 'number') return getResponse(false, null, '\`max\` can only have a value of number.');

  // Generic email validation if no domains provided
  if (!domains || (Array.isArray(domains) && domains.length === 0)) {

    const standardPattern = new RegExp(`^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,${max || 3}})+$`);
    return getResponse(standardPattern.test(email), email);
  }

  const isDomainsString = typeof domains === 'string';
  const isDomainsValidArray = Array.isArray(domains) && domains.every(domain => typeof domain === 'string');
  const isStringOrArray = isDomainsString || isDomainsValidArray;

  // Check if domains is a valid data type
  if (!isStringOrArray) return getResponse(false, null, '\`domains\` can only have a value of string or array of strings.');

  // Check if max is provided alongside domains
  if (max) return getResponse(false, null, '\`max\` can only be used if \`domains\` are not provided.');

  // Validate email with a single domain restriction
  if (isDomainsString || domains.length === 1) {
    const emailDomain = isDomainsString ? domains : domains[0];
    const isDomainValid = DOMAIN_REGEX.test(emailDomain);
    if (!isDomainValid) return getResponse(false, email, `\`${domains}\` is not a valid domain.`);

    const [name, extension] = (isDomainsString ? domains : domains[0]).split('.');

    return getResponse(EMAIL_WITH_DOMAIN_REGEX(name, extension).test(email), email);
  }

  // Validate email with multiple domain restrictions
  const domainResults = validateDomains(domains);

  // Return error message if domains got invalid entries
  if (domainResults.error) return getResponse(false, email, domainResults.error);

  let isValid = false;

  // Validate email address with multiple domains provided in the options
  for (const domain of domains) {
    const [name, extension] = domain.split('.');
    isValid = EMAIL_WITH_DOMAIN_REGEX(name, extension).test(email);

    // Stop the loop if a domain matches the email
    if (isValid) {
      isValid = true;
      break;
    }
  }

  return getResponse(isValid, email);
};

export { checkEmail, CheckEmailOptions, ValidationResult };
