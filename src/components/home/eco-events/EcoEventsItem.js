import React from 'react';
import { Link } from 'react-router-dom';
import './EcoEventsItem.scss';

const EcoEventsItem = ({ ecoEvent, mainEvent = false }) => {
  if (!ecoEvent) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`eco-event-item ${mainEvent ? 'main-event-item' : ''}`}>
      <div className="event-content">
        <h3 className="event-title">
          <Link to={`/news/${ecoEvent.id}`}>{ecoEvent.title}</Link>
        </h3>
        <p className="event-description">{ecoEvent.content}</p>
        <div className="event-info">
          <span className="event-author">{ecoEvent.author?.name || 'Unknown Author'}</span>
          <span className="event-date">{formatDate(ecoEvent.creationDate)}</span>
        </div>
      </div>
    </div>
  );
};

export default EcoEventsItem;
