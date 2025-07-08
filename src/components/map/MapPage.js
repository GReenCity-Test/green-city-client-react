import React, { useState, useEffect } from 'react';
import MapService from '../../services/map/MapService';
import InteractiveMap from './interactive-map/InteractiveMap';
import PlaceDetails from './place-details/PlaceDetails';
import './MapPage.scss';

const MapPage = () => {
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [favoritePlaces, setFavoritePlaces] = useState([]);

  useEffect(() => {
    loadPlacesAndCategories();
    loadFavoritePlaces();
  }, []);

  const loadPlacesAndCategories = async () => {
    try {
      setLoading(true);

      // Load places and categories in parallel
      const [placesData, categoriesData] = await Promise.all([
        MapService.getAllPlaces(),
        MapService.getCategories()
      ]);

      setPlaces(placesData);
      setCategories(categoriesData);
      setError(null);
    } catch (error) {
      console.error('Error loading map data:', error);
      setError('Failed to load map data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadFavoritePlaces = async () => {
    try {
      const favorites = await MapService.getFavoritePlaces();
      setFavoritePlaces(favorites);

      // Mark favorite places
      setPlaces(prevPlaces =>
        prevPlaces.map(place => ({
          ...place,
          favorite: favorites.some(fav => fav.id === place.id)
        }))
      );
    } catch (error) {
      console.error('Error loading favorite places:', error);
      // Non-critical error, don't show to user
    }
  };

  const filterPlacesByCategory = async (categoryId) => {
    try {
      setLoading(true);
      setSelectedCategory(categoryId);

      if (!categoryId) {
        // If no category selected, load all places
        const placesData = await MapService.getAllPlaces();
        setPlaces(placesData.map(place => ({
          ...place,
          favorite: favoritePlaces.some(fav => fav.id === place.id)
        })));
      } else {
        // Filter places by category
        const filter = { categoryId };
        const filteredPlaces = await MapService.getPlacesByFilter(filter);
        setPlaces(filteredPlaces.map(place => ({
          ...place,
          favorite: favoritePlaces.some(fav => fav.id === place.id)
        })));
      }

      setError(null);
    } catch (error) {
      console.error('Error filtering places:', error);
      setError('Failed to filter places. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMapIdle = () => {
    // Could implement additional logic here if needed
    console.log('Map is idle');
  };

  const handleMapBoundsChange = (bounds) => {
    setMapBounds(bounds);
  };

  const handleMapCenterChange = (center) => {
    setMapCenter(center);
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
  };

  const handleToggleFavorite = async (place) => {
    try {
      if (place.favorite) {
        await MapService.removeFromFavorites(place.id);
      } else {
        await MapService.addToFavorites(place.id);
      }

      // Update place in state
      setPlaces(prevPlaces =>
        prevPlaces.map(p =>
          p.id === place.id ? { ...p, favorite: !p.favorite } : p
        )
      );

      // Update selected place if it's the one being toggled
      if (selectedPlace && selectedPlace.id === place.id) {
        setSelectedPlace({ ...selectedPlace, favorite: !selectedPlace.favorite });
      }

      // Refresh favorite places
      loadFavoritePlaces();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite status. Please try again.');
    }
  };

  return (
    <div className="map-page">
      <div className="container">
        <h1>Eco-Friendly Places</h1>
        <p className="intro">Find eco-friendly places near you and contribute to a greener planet.</p>

        {error && <div className="error-message">{error}</div>}

        <div className="map-container">
          <div className="map-area">
            <InteractiveMap
              places={places}
              onMapIdle={handleMapIdle}
              onMapBoundsChange={handleMapBoundsChange}
              onMapCenterChange={handleMapCenterChange}
              onPlaceSelect={handlePlaceSelect}
              selectedPlace={selectedPlace}
            />
          </div>

          <div className="map-sidebar">
            <div className="sidebar-section">
              <div className="category-filter">
                <h3>Filter by Category</h3>
                <div className="category-list">
                  <button
                    className={`category-item ${!selectedCategory ? 'active' : ''}`}
                    onClick={() => filterPlacesByCategory(null)}
                  >
                    All Categories
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                      onClick={() => filterPlacesByCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <PlaceDetails
                place={selectedPlace}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>

            <div className="sidebar-section">
              <div className="places-list">
                <h3>Places ({places.length})</h3>
                {loading ? (
                  <div className="loading-spinner">
                    <p>Loading places...</p>
                  </div>
                ) : places.length > 0 ? (
                  <ul>
                    {places.map(place => (
                      <li
                        key={place.id}
                        className={`place-item ${selectedPlace && selectedPlace.id === place.id ? 'active' : ''}`}
                        onClick={() => handlePlaceSelect(place)}
                      >
                        <h4>{place.name}</h4>
                        <p>{place.location.address}</p>
                        {place.favorite && <span className="favorite-badge">★</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-places">No places found for the selected category.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
