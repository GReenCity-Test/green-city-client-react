import {useNavigate, Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useAuth} from '../../contexts/AuthContext';
import {useTranslation} from '../../services/translation/TranslationService';
import {AUTH_IMAGES} from '../../constants/imagePaths';
import GoogleButton from './GoogleButton';
import createSignInSchema from '../../schemas/signInSchema';
import {signInPropTypes, signInDefaultProps} from './SignIn.propTypes';
import './Auth.scss';
import {useState} from "react";

const SignIn = ({onPageChange, onClose}) => {
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const {signIn} = useAuth();
    const navigate = useNavigate();
    const {t} = useTranslation();

    const signInSchema = createSignInSchema(t);

    const {
        register,
        handleSubmit: validateAndSubmit,
        formState: {errors, isDirty, isValid},
        reset
    } = useForm({
        resolver: zodResolver(signInSchema),
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: ''
        }
    });

    // Handle successful Google sign-in
    const handleGoogleSuccess = (userData) => {
        if (onClose) {
            onClose();
        }
        navigate('/');
    };

    // Handle Google sign-in error
    const handleGoogleError = (error) => {
        setGeneralError(error.message || t('auth.googleSignInError', 'Failed to sign in with Google. Please try again.'));
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Form submission handler
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setGeneralError('');
            await signIn(data.email, data.password);
            reset();
            if (onClose) {
                onClose();
            }
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.message || t('auth.signInError', 'Failed to sign in. Please check your credentials.');
            setGeneralError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getInputClass = (fieldName) => {
        if (errors[fieldName]) {
            return 'input-error';
        }
        if (isDirty) {
            return 'input-success';
        }
        return '';
    };

    // Get label class based on validation state
    const getLabelClass = (fieldName) => {
        return errors[fieldName] ? 'label-error' : '';
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{t('auth.signIn', 'Sign In')}</h2>
                {generalError && <div className="error-message general-error">{generalError}</div>}

                {/* Google Sign-In Button */}
                <GoogleButton
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useGetAuth={true}
                />

                {/* Separator */}
                <div className="auth-separator">{t('auth.or', 'or')}</div>

                <form onSubmit={validateAndSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="email" className={getLabelClass('email')}>{t('auth.email', 'Email')}</label>
                        <input
                            type="email"
                            id="email"
                            placeholder={t('auth.emailPlaceholder', 'example@email.com')}
                            className={getInputClass('email')}
                            aria-describedby="email-error"
                            {...register('email')}
                        />
                        {errors.email && (
                            <div className="field-error-message" id="email-error" role="alert">
                                {errors.email.message}
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"
                               className={getLabelClass('password')}>{t('auth.password', 'Password')}</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
                                className={getInputClass('password')}
                                aria-describedby="password-error"
                                {...register('password')}
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? t('auth.hidePassword', 'Hide password') : t('auth.showPassword', 'Show password')}
                            >
                                <img
                                    src={showPassword ? AUTH_IMAGES.EYE_SHOW : AUTH_IMAGES.EYE_HIDE}
                                    alt={showPassword ? t('auth.hidePassword', 'Hide password') : t('auth.showPassword', 'Show password')}
                                />
                            </button>
                        </div>
                        {errors.password && (
                            <div className="field-error-message" id="password-error" role="alert">
                                {errors.password.message}
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading || !isValid}
                    >
                        {loading ? t('auth.signingIn', 'Signing In...') : t('auth.signInButton', 'Sign In')}
                    </button>
                </form>
                <div className="auth-links">
                    <p>{t('auth.dontHaveAccount', 'Don\'t have an account?')} {onPageChange ? (
                        <button className="text-button"
                                onClick={() => onPageChange('sign-up')}>{t('auth.signUp', 'Sign Up')}</button>
                    ) : (
                        <Link to="/auth/sign-up">{t('auth.signUp', 'Sign Up')}</Link>
                    )}</p>
                    <p>{onPageChange ? (
                        <button className="text-button"
                                onClick={() => onPageChange('restore-password')}>{t('auth.forgotPassword', 'Forgot Password?')}</button>
                    ) : (
                        <Link to="/auth/forgot-password">{t('auth.forgotPassword', 'Forgot Password?')}</Link>
                    )}</p>
                </div>
            </div>
        </div>
    );
};

SignIn.propTypes = signInPropTypes;
SignIn.defaultProps = signInDefaultProps;
export default SignIn;
