import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import './PlaceDetails.scss';

// Icons
const starIcon = '/assets/img/places/star.svg';
const starHalfIcon = '/assets/img/places/star-half.svg';
const starUnfilledIcon = '/assets/img/places/star-unfilled.svg';
const favoriteIcon = '/assets/img/places/favorite.svg';
const favoriteOutlineIcon = '/assets/img/places/favorite-outline.svg';
const shareIcon = '/assets/img/places/share.svg';

/**
 * Component for displaying detailed information about a place
 */
const PlaceDetails = ({ place, onToggleFavorite }) => {
  const { isAuthenticated } = useAuth();

  if (!place) {
    return (
      <div className="place-details-empty">
        <p>Select a place on the map to view details</p>
      </div>
    );
  }

  /**
   * Generate star rating display
   * @param {number} rating - Rating value (0-5)
   * @returns {JSX.Element[]} Array of star icons
   */
  const getStars = (rating) => {
    const stars = [];
    const maxRating = 5;
    const validRating = Math.min(rating || 0, maxRating);

    // Add full stars
    for (let i = 0; i < Math.floor(validRating); i++) {
      stars.push(<img key={`star-${i}`} src={starIcon} alt="star" className="star-icon" />);
    }

    // Add half star if needed
    if (Math.floor(validRating) < validRating) {
      stars.push(<img key="star-half" src={starHalfIcon} alt="half star" className="star-icon" />);
    }

    // Add empty stars
    for (let i = stars.length; i < maxRating; i++) {
      stars.push(<img key={`star-empty-${i}`} src={starUnfilledIcon} alt="empty star" className="star-icon" />);
    }

    return stars;
  };

  /**
   * Handle favorite button click
   */
  const handleFavoriteClick = () => {
    if (isAuthenticated()) {
      onToggleFavorite(place);
    } else {
      // Redirect to login or show login modal
      alert('Please sign in to add places to favorites');
    }
  };

  /**
   * Handle share button click
   */
  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: place.name,
        text: `Check out ${place.name} on Green City!`,
        url: window.location.href
      }).catch(error => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      const url = window.location.href;
      navigator.clipboard.writeText(url)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Could not copy text: ', err));
    }
  };

  return (
    <div className="place-details">
      <div className="place-header">
        <h2 className="place-name">{place.name}</h2>
        <div className="place-actions">
          <button
            className="action-button favorite-button"
            onClick={handleFavoriteClick}
            aria-label={place.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <img
              src={place.favorite ? favoriteIcon : favoriteOutlineIcon}
              alt={place.favorite ? "Favorite" : "Not favorite"}
            />
          </button>
          <button
            className="action-button share-button"
            onClick={handleShareClick}
            aria-label="Share place"
          >
            <img src={shareIcon} alt="Share" />
          </button>
        </div>
      </div>

      <div className="place-info">
        <div className="place-address">
          <p>{place.location.address}</p>
        </div>

        {place.rating && (
          <div className="place-rating">
            <div className="stars">{getStars(place.rating)}</div>
            <span className="rating-value">{place.rating.toFixed(1)}</span>
          </div>
        )}

        {place.openingHours && (
          <div className="place-hours">
            <h3>Opening Hours</h3>
            <ul className="hours-list">
              {place.openingHours.map((hours, index) => (
                <li key={index} className="hours-item">
                  <span className="day">{hours.weekDay}</span>
                  <span className="time">
                    {hours.openTime.hour}:{hours.openTime.minute.toString().padStart(2, '0')} -
                    {hours.closeTime.hour}:{hours.closeTime.minute.toString().padStart(2, '0')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {place.category && (
          <div className="place-category">
            <h3>Category</h3>
            <p>{place.category.name}</p>
          </div>
        )}

        {place.description && (
          <div className="place-description">
            <h3>Description</h3>
            <p>{place.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceDetails;
