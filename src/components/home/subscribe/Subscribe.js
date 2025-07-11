import React, { useState } from 'react';
import { useTranslation } from '../../../services/translation/TranslationService';
import './Subscribe.scss';

const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const { t } = useTranslation();

  // Email regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const qrCode = '/assets/img/qr-code.png';

  const validateEmail = (value) => {
    const isValid = value.length > 0 && emailRegex.test(value);
    setEmailValid(isValid);
    return isValid;
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailTouched(true);
    validateEmail(newEmail);
  };

  const subscribeToNewsletter = () => {
    if (emailValid) {
      // TODO: Implement subscription service
      alert(`Subscribed with email: ${email}`);

      // Reset form
      setEmail('');
      setEmailTouched(false);
      setEmailValid(false);
    } else {
      setEmailTouched(true);
    }
  };

  return (
    <div id="subscribe">
      <div id="subscribe-wrapper">
        <div id="qr-code-wrapper">
          <img src={qrCode} alt="Scan this QR-code To access the mobile version of the app" />
        </div>
        <div id="form-wrapper">
          <h2>{t('homepage.subscription.caption')}</h2>
          <p>{t('homepage.subscription.content')}</p>
          <div className="form-input">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder={t('homepage.subscription.placeholder')}
            />
            <p
              id="validation-error"
              className={!emailTouched || emailValid ? 'hidden' : 'visible'}
            >
              {t('homepage.subscription.validation-error')}
            </p>
            <button
              className="primary-global-button btn"
              onClick={subscribeToNewsletter}
            >
              {t('homepage.subscription.button-subscribe')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
