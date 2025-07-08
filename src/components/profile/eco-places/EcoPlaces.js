import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PlaceService from '../../../services/place/PlaceService';
import './EcoPlaces.scss';

/**
 * Component for displaying a user's favorite eco places
 */
const EcoPlaces = () => {
  const { t, i18n } = useTranslation();
  const [ecoPlaces, setEcoPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEcoPlaces();
  }, [i18n.language]);

  /**
   * Fetch eco places data
   */
  const fetchEcoPlaces = async () => {
    try {
      setLoading(true);
      const places = await PlaceService.getEcoPlaces();
      setEcoPlaces(places);
      setError(null);
    } catch (error) {
      console.error('Error fetching eco places:', error);
      setError('Failed to load eco places. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="eco-places-content">
        <div className="loading">Loading eco places...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="eco-places-content">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="eco-places-content">
      <div className="header-position">
        <div className="header">
          <p className="title">{t('profile.my-eco-places')}</p>
          {ecoPlaces.length > 3 && (
            <a className="btn-see-all">{t('profile.see-all')}</a>
          )}
        </div>
        <div className="favourites-quantity">
          <span>
            {ecoPlaces.length} {t('profile.eco-places-quantity', { count: ecoPlaces.length })}
          </span>
        </div>
      </div>
      <div>
        <ul className="eco-place-list">
          {ecoPlaces.map(place => (
            <li key={place.placeId} className="item">
              <span className="flag-default"></span>
              {place.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EcoPlaces;
