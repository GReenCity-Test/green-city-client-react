import { z } from 'zod';

/**
 * Creates a validation schema for the sign-up form with localized error messages
 * @param {Function} t - Translation function from useTranslation hook
 * @returns {z.ZodObject} - Zod validation schema
 */
export const createSignUpSchema = (t) => {
  return z.object({
    name: z.string()
      .min(2, t('auth.nameMinLength', 'Name must be at least 2 characters long'))
      .max(30, t('auth.nameMaxLength', 'Name must not exceed 30 characters'))
      .nonempty(t('auth.nameRequired', 'Name is required')),
    
    email: z.string()
      .nonempty(t('auth.emailRequired', 'Email is required'))
      .email(t('auth.emailInvalid', 'This is not a valid email')),
    
    password: z.string()
      .nonempty(t('auth.passwordRequired', 'Password is required'))
      .min(8, t('auth.passwordMinLength', 'Password must be at least 8 characters long'))
      .max(20, t('auth.passwordMaxLength', 'Password must not exceed 20 characters'))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        t('auth.passwordPattern', 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
      ),
    
    confirmPassword: z.string()
      .nonempty(t('auth.confirmPasswordRequired', 'Please confirm your password'))
  }).refine(
    (data) => data.password === data.confirmPassword,
    {
      message: t('auth.passwordsDoNotMatch', 'Passwords do not match'),
      path: ['confirmPassword']
    }
  );
};

export default createSignUpSchema;