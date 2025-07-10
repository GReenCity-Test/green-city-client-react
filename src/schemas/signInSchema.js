import { z } from 'zod';

/**
 * Creates a validation schema for the sign-in form with localized error messages
 * @param {Function} t - Translation function from useTranslation hook
 * @returns {z.ZodObject} - Zod validation schema
 */
export const createSignInSchema = (t) => {
  return z.object({
    email: z.string()
      .nonempty(t('auth.emailRequired', 'Email is required'))
      .email(t('auth.emailInvalid', 'This is not a valid email')),
    
    password: z.string()
      .nonempty(t('auth.passwordRequired', 'Password is required'))
      .min(8, t('auth.passwordMinLength', 'Password must be at least 8 characters long'))
      .max(20, t('auth.passwordMaxLength', 'Password must not exceed 20 characters'))
  });
};

export default createSignInSchema;