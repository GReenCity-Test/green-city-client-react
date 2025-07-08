import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AbsenceEvents.scss';

// This will be implemented later
// import EventService from '../../../services/events/EventService';

/**
 * AbsenceEvents component displays a list of absence events
 * These are events where the user has registered but was absent
 *
 * @returns {JSX.Element} - Rendered component
 */
const AbsenceEvents = () => {
  const navigate = useNavigate();
  const [absenceEvents, setAbsenceEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // This will be replaced with actual API call
    const fetchAbsenceEvents = async () => {
      try {
        setLoading(true);
        // const response = await EventService.getAbsenceEvents(page);
        // setAbsenceEvents(response.events);
        // setTotalPages(response.totalPages);

        // Mock data for now
        setAbsenceEvents([
          {
            id: 1,
            title: 'Earth Day Celebration',
            date: '2023-04-22',
            location: 'Central Park',
            image: 'assets/img/events/event1.jpg',
            absenceReason: 'Weather conditions'
          },
          {
            id: 2,
            title: 'Beach Cleanup',
            date: '2023-05-15',
            location: 'Sunny Beach',
            image: 'assets/img/events/event2.jpg',
            absenceReason: 'Personal emergency'
          }
        ]);
        setTotalPages(1);
        setError(null);
      } catch (err) {
        setError('Failed to load absence events. Please try again later.');
        console.error('Error fetching absence events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAbsenceEvents();
  }, [page]);

  const handleEventClick = (eventId) => {
    navigate(`/events/details/${eventId}`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  if (loading) {
    return <div className="events-loading">Loading absence events...</div>;
  }

  if (error) {
    return <div className="events-error">{error}</div>;
  }

  return (
    <div className="absence-events">
      <div className="absence-info">
        <div className="absence-info-icon">
          <i className="fas fa-info-circle"></i>
        </div>
        <div className="absence-info-text">
          <p>
            This page shows events you registered for but were unable to attend.
            Maintaining a good attendance record helps event organizers plan effectively
            and ensures spots aren't wasted.
          </p>
        </div>
      </div>

      {absenceEvents.length > 0 ? (
        <div className="absence-events-list">
          {absenceEvents.map(event => (
            <div
              key={event.id}
              className="absence-event-card"
              onClick={() => handleEventClick(event.id)}
            >
              <div className="absence-event-image">
                <img src={event.image} alt={event.title} />
                <div className="absence-badge">Absent</div>
              </div>
              <div className="absence-event-info">
                <h3 className="absence-event-title">{event.title}</h3>
                <p className="absence-event-date">{new Date(event.date).toLocaleDateString()}</p>
                <p className="absence-event-location">{event.location}</p>
                <div className="absence-reason">
                  <span className="absence-reason-label">Reason:</span>
                  <span className="absence-reason-text">{event.absenceReason}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-absence-events">
          <h3>No absence events found</h3>
          <p>Great job! You have attended all events you registered for.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </button>

          {[...Array(totalPages).keys()].map(i => (
            <button
              key={i + 1}
              className={`pagination-button ${page === i + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="pagination-button"
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AbsenceEvents;
