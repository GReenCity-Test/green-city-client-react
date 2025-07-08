import React from 'react';
import { Link } from 'react-router-dom';
import './VisionCard.scss';

/**
 * @typedef {import('./models/VisionCard').VisionCard} VisionCardType
 */

/**
 * VisionCard component displays a card with an image, title, description, and link
 *
 * @param {Object} props - Component props
 * @param {VisionCardType} props.card - The vision card data
 * @param {string} props.className - Additional CSS class name
 * @returns {JSX.Element} - Rendered component
 */
const VisionCard = ({ card, className }) => {
  const isEven = card.id % 2 === 0;

  return (
    <div className={`vision-card ${isEven ? 'card-order-even' : ''} ${className || ''}`}>
      <img src={card.imgUrl} alt={card.alt} />
      <div className="vision-card__content">
        <div className="vision-card__title">
          <span className="vision-card__title__number">{card.id}</span>
          <h3 className="vision-card__title__text">{card.title}</h3>
        </div>
        <div className="vision-card__info">
          <p className="vision-card__description">
            {card.description}
          </p>
          {card.linkPath && card.linkPath.length > 0 ? (
            <Link
              to={card.linkPath.join('/')}
              className="vision-card__link"
              state={card.navigationExtras}
            >
              <span>{card.linkText}</span>
              <span className="chevron-icon">›</span>
            </Link>
          ) : (
            <span className="disabled-link vision-card__link" title="This feature is coming soon">
              <span>{card.linkText}</span>
              <span className="chevron-icon">›</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisionCard;
