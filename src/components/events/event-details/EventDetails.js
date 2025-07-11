import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicAssetPath } from '../../../constants/imagePaths';
import './EventDetails.scss';

// This will be implemented later
// import EventService from '../../../services/events/EventService';

/**
 * EventDetails component displays detailed information about a specific event
 *
 * @returns {JSX.Element} - Rendered component
 */
const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // This will be replaced with actual API call
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        // const response = await EventService.getEventById(eventId);
        // setEvent(response);
        // setIsRegistered(response.isUserRegistered);

        // Mock data for now
        setEvent({
          id: parseInt(eventId),
          title: 'Earth Day Celebration',
          date: '2023-04-22T10:00:00',
          endDate: '2023-04-22T16:00:00',
          location: 'Central Park, New York',
          description: `Join us for a day of environmental awareness and action!
            This Earth Day celebration will feature educational booths, tree planting,
            clean-up activities, and workshops on sustainable living.

            Bring your family and friends to learn how small changes can make a big impact
            on our planet's health. Refreshments will be provided, and all participants
            will receive a free reusable water bottle.`,
          organizer: 'Green City Environmental Group',
          image: getPublicAssetPath('img/events/event1.jpg'),
          additionalImages: [
            getPublicAssetPath('img/events/event1-1.jpg'),
            getPublicAssetPath('img/events/event1-2.jpg')
          ],
          capacity: 200,
          registeredCount: 150,
          tags: ['Earth Day', 'Environment', 'Sustainability', 'Community']
        });
        setIsRegistered(false);
        setError(null);
      } catch (err) {
        setError('Failed to load event details. Please try again later.');
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleRegister = async () => {
    try {
      // await EventService.registerForEvent(eventId);
      setIsRegistered(true);
      // Show success message
    } catch (err) {
      // Show error message
      console.error('Error registering for event:', err);
    }
  };

  const handleCancelRegistration = async () => {
    try {
      // await EventService.cancelEventRegistration(eventId);
      setIsRegistered(false);
      // Show success message
    } catch (err) {
      // Show error message
      console.error('Error canceling event registration:', err);
    }
  };

  const handleBackClick = () => {
    navigate('/events');
  };

  if (loading) {
    return <div className="event-details-loading">Loading event details...</div>;
  }

  if (error) {
    return <div className="event-details-error">{error}</div>;
  }

  if (!event) {
    return <div className="event-details-error">Event not found.</div>;
  }

  const eventDate = new Date(event.date);
  const eventEndDate = new Date(event.endDate);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = `${eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })} - ${eventEndDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })}`;

  const remainingSpots = event.capacity - event.registeredCount;
  const isFullyBooked = remainingSpots <= 0;

  return (
    <div className="event-details">
      <button className="back-button" onClick={handleBackClick}>
        ← Back to Events
      </button>

      <div className="event-header">
        <div className="event-image-container">
          <img src={event.image} alt={event.title} className="event-main-image" />
        </div>
        <div className="event-header-info">
          <h1 className="event-title">{event.title}</h1>
          <div className="event-meta">
            <div className="event-meta-item">
              <i className="fas fa-calendar"></i>
              <span>{formattedDate}</span>
            </div>
            <div className="event-meta-item">
              <i className="fas fa-clock"></i>
              <span>{formattedTime}</span>
            </div>
            <div className="event-meta-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>{event.location}</span>
            </div>
            <div className="event-meta-item">
              <i className="fas fa-user"></i>
              <span>{event.organizer}</span>
            </div>
          </div>

          <div className="event-capacity">
            <div className="capacity-bar">
              <div
                className="capacity-fill"
                style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
              ></div>
            </div>
            <div className="capacity-text">
              {isFullyBooked ? (
                <span className="fully-booked">Fully Booked</span>
              ) : (
                <span>{remainingSpots} spots remaining</span>
              )}
            </div>
          </div>

          {isRegistered ? (
            <button
              className="cancel-registration-button"
              onClick={handleCancelRegistration}
            >
              Cancel Registration
            </button>
          ) : (
            <button
              className="register-button"
              onClick={handleRegister}
              disabled={isFullyBooked}
            >
              {isFullyBooked ? 'Event Full' : 'Register for Event'}
            </button>
          )}
        </div>
      </div>

      <div className="event-content">
        <div className="event-description">
          <h2>About This Event</h2>
          <div className="description-text">
            {event.description.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {event.additionalImages && event.additionalImages.length > 0 && (
          <div className="event-gallery">
            <h2>Event Gallery</h2>
            <div className="gallery-images">
              {event.additionalImages.map((image, index) => (
                <div key={index} className="gallery-image-container">
                  <img src={image} alt={`${event.title} - image ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {event.tags && event.tags.length > 0 && (
          <div className="event-tags">
            <h2>Tags</h2>
            <div className="tags-list">
              {event.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
