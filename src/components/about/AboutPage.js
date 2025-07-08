import React from 'react';
import { useNavigate } from 'react-router-dom';
import VisionCard from './VisionCard';
import { visionCards } from './constants/vision-cards';
import { ABOUT_IMAGES } from '../../constants/imagePaths';
import './AboutPage.scss';
// some comments
const AboutPage = () => {
  const navigate = useNavigate();

  const navigateToHabit = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      navigate(`/profile/${userId}`);
    } else {
      // If not logged in, redirect to sign in page
      navigate('/auth/sign-in');
    }
  };

  const generateVisionCardClass = (idx) => {
    return `vision-card vision-card__${idx + 1}`;
  };

  return (
    <main id="main-content" role="main">
      <div className="about-page">
        <div className="container">
          <h1>About Us</h1>
          <p className="intro">
            GreenCity project addresses the challenge of significant changes in behaviors and lifestyles of Lviv citizens.
          </p>

          <button className="primary-global-button section__button" onClick={navigateToHabit}>
            Format Habit
          </button>

          <div className="about-section section">
            <div className="grey-text section__content">
              <h2 className="section__header">Our Mission</h2>
              <p className="section__description">
                Is to help people get sustainable eco habits in an easy and fun way and gain support of the like-minded people.
              </p>
              <button className="primary-global-button section__button" onClick={navigateToHabit}>
                Format Habit
              </button>
            </div>
            <img src={ABOUT_IMAGES.ILLUSTRATION_MAN} alt="Illustration man" className="hero-bcg" />
          </div>

          <div className="vision-section">
            <div className="section">
              <div className="grey-text section__content">
                <h2 className="section__header">Our Vision</h2>
                <p className="section__description">
                  A world where sustainable living is the norm, not the exception. We envision communities where
                  eco-consciousness is integrated into everyday life, and where people are empowered to make
                  environmentally responsible choices.
                </p>
                <button className="primary-global-button section__button" onClick={navigateToHabit}>
                  Join Us
                </button>
              </div>
              <img src={ABOUT_IMAGES.VISION} alt="vision" />
            </div>
          </div>

          <div className="vision-gallery">
            <div className="vision-gallery__decorative-bcg"></div>
            <h2 className="grey-text vision-gallery__header">
              How It Works
            </h2>
            {visionCards.map((card, index) => (
              <VisionCard
                key={card.id}
                card={card}
                className={generateVisionCardClass(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutPage;
