import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventList.scss';

// This will be implemented later
// import EventService from '../../../services/events/EventService';

/**
 * EventList component displays a list of events with filtering and pagination
 *
 * @returns {JSX.Element} - Rendered component
 */
const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // This will be replaced with actual API call
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // const response = await EventService.getEvents(page, filter);
        // setEvents(response.events);
        // setTotalPages(response.totalPages);

        // Mock data for now
        setEvents([
          { id: 1, title: 'Earth Day Celebration', date: '2023-04-22', location: 'Central Park', image: 'assets/img/events/event1.jpg' },
          { id: 2, title: 'Beach Cleanup', date: '2023-05-15', location: 'Sunny Beach', image: 'assets/img/events/event2.jpg' },
          { id: 3, title: 'Tree Planting Day', date: '2023-06-05', location: 'City Forest', image: 'assets/img/events/event3.jpg' },
        ]);
        setTotalPages(3);
        setError(null);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, filter]);

  const handleEventClick = (eventId) => {
    navigate(`/events/details/${eventId}`);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  if (loading) {
    return <div className="events-loading">Loading events...</div>;
  }

  if (error) {
    return <div className="events-error">{error}</div>;
  }

  return (
    <div className="event-list">
      <div className="event-filters">
        <button
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All
        </button>
        <button
          className={`filter-button ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => handleFilterChange('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`filter-button ${filter === 'past' ? 'active' : ''}`}
          onClick={() => handleFilterChange('past')}
        >
          Past
        </button>
      </div>

      <div className="event-grid">
        {events.length > 0 ? (
          events.map(event => (
            <div
              key={event.id}
              className="event-card"
              onClick={() => handleEventClick(event.id)}
            >
              <div className="event-image">
                <img src={event.image} alt={event.title} />
              </div>
              <div className="event-info">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
                <p className="event-location">{event.location}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-events">No events found.</div>
        )}
      </div>

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

export default EventList;
