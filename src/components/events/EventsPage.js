import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './EventsPage.scss';

// Import components
import EventList from './event-list/EventList';
import EventDetails from './event-details/EventDetails';
import AbsenceEvents from './absence-events/AbsenceEvents';

/**
 * EventsPage component serves as the main container for the events module
 * It includes routes for event list, event details, and absence events
 *
 * @returns {JSX.Element} - Rendered component
 */
const EventsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Set active tab based on URL
    const path = location.pathname;
    if (path.includes('/absence')) {
      setActiveTab('absence');
    } else if (path.includes('/details')) {
      setActiveTab('all');
    } else {
      setActiveTab('all');
    }
  }, [location]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'all') {
      navigate('/events');
    } else if (tab === 'absence') {
      navigate('/events/absence');
    }
  };

  return (
    <div className="events-page">
      <div className="container">
        <h1 className="events-page-title">Events</h1>

        <div className="events-tabs">
          <button
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            All Events
          </button>
          <button
            className={`tab-button ${activeTab === 'absence' ? 'active' : ''}`}
            onClick={() => handleTabChange('absence')}
          >
            Absence Events
          </button>
        </div>

        <div className="events-content">
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/details/:eventId" element={<EventDetails />} />
            <Route path="/absence" element={<AbsenceEvents />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
