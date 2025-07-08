import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import './InteractiveMap.scss';

// Map container style
const containerStyle = {
  width: '100%',
  height: '100%'
};

// Default center (can be overridden by props)
const defaultCenter = {
  lat: 49.84579567734425,
  lng: 24.025124653312258
};

/**
 * Interactive map component using Google Maps
 */
const InteractiveMap = ({
  places = [],
  onMapIdle,
  onMapBoundsChange,
  onMapCenterChange,
  onPlaceSelect,
  selectedPlace
}) => {
  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''
  });

  // State for map instance and selected marker
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Callback when map is loaded
  const onLoad = useCallback((map) => {
    setMap(map);
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setCenter(userLocation);
        },
        () => {
          // Use default center if geolocation fails
          map.setCenter(defaultCenter);
        }
      );
    } else {
      // Use default center if geolocation is not supported
      map.setCenter(defaultCenter);
    }
  }, []);

  // Callback when map is unmounted
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle map idle event
  const handleIdle = useCallback(() => {
    if (map && onMapIdle) {
      onMapIdle();
    }
  }, [map, onMapIdle]);

  // Handle map bounds change event
  const handleBoundsChanged = useCallback(() => {
    if (map && onMapBoundsChange) {
      const bounds = map.getBounds();
      if (bounds) {
        onMapBoundsChange(bounds);
      }
    }
  }, [map, onMapBoundsChange]);

  // Handle map center change event
  const handleCenterChanged = useCallback(() => {
    if (map && onMapCenterChange) {
      const center = map.getCenter();
      if (center) {
        onMapCenterChange({
          lat: center.lat(),
          lng: center.lng()
        });
      }
    }
  }, [map, onMapCenterChange]);

  // Handle marker click
  const handleMarkerClick = useCallback((place) => {
    setSelectedMarker(place);
    if (onPlaceSelect) {
      onPlaceSelect(place);
    }
  }, [onPlaceSelect]);

  // Update selected marker when selectedPlace changes
  useEffect(() => {
    if (selectedPlace && (!selectedMarker || selectedMarker.id !== selectedPlace.id)) {
      setSelectedMarker(selectedPlace);
    }
  }, [selectedPlace]);

  // Show error if Google Maps API fails to load
  if (loadError) {
    return <div className="map-error">Error loading Google Maps</div>;
  }

  // Show loading indicator while Google Maps API is loading
  if (!isLoaded) {
    return <div className="map-loading">Loading Google Maps...</div>;
  }

  return (
    <div className="interactive-map">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onIdle={handleIdle}
        onBoundsChanged={handleBoundsChanged}
        onCenterChanged={handleCenterChanged}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: true
        }}
      >
        {/* Render markers for each place */}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={{
              lat: place.location.lat,
              lng: place.location.lng
            }}
            onClick={() => handleMarkerClick(place)}
            icon={{
              url: place.favorite ? '/assets/img/places/marker-favorite.svg' : '/assets/img/places/marker-default.svg',
              scaledSize: new window.google.maps.Size(32, 32)
            }}
          />
        ))}

        {/* Show info window for selected marker */}
        {selectedMarker && (
          <InfoWindow
            position={{
              lat: selectedMarker.location.lat,
              lng: selectedMarker.location.lng
            }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="info-window">
              <h3>{selectedMarker.name}</h3>
              <p>{selectedMarker.location.address}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default InteractiveMap;
