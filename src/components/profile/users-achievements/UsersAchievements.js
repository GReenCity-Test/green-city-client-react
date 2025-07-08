import React, { useState, useEffect, useRef } from 'react';
import AchievementService from '../../../services/achievement/AchievementService';
import './UsersAchievements.scss';

/**
 * UsersAchievements component displays a user's achievements
 *
 * @returns {JSX.Element} - Rendered component
 */
const UsersAchievements = () => {
  // State for achievements data
  const [achievements, setAchievements] = useState([]);
  const [achievementsToShow, setAchievementsToShow] = useState([]);
  const [amountOfAchievements, setAmountOfAchievements] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Refs for slider elements
  const sliderRef = useRef(null);
  const nextArrowRef = useRef(null);
  const previousArrowRef = useRef(null);

  // Items per page based on screen width
  const itemsMap = { 768: 3, 576: 5, 320: 3 };

  // Arrow images
  const arrows = {
    arrowPrevious: 'assets/img/calendar/arrow-left.svg',
    arrowNext: 'assets/img/calendar/arrow-right.svg'
  };

  // Load achievements on component mount
  useEffect(() => {
    showAchievements();

    // Add resize event listener
    const handleResize = () => {
      calculateAchievementsToShow();
    };

    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update achievements to show when achievements or slideIndex changes
  useEffect(() => {
    calculateAchievementsToShow();
  }, [achievements, slideIndex]);

  /**
   * Fetch achievements from the service
   */
  const showAchievements = async () => {
    try {
      const achievementsData = await AchievementService.getAchievements();
      setAchievements(achievementsData);
      setAmountOfAchievements(achievementsData.length);
      setTotalPages(Math.ceil(achievementsData.length / itemsPerPage));
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  /**
   * Calculate which achievements to show based on screen size and current page
   */
  const calculateAchievementsToShow = () => {
    if (achievements.length > 0) {
      const newItemsPerPage = getAchievementsToShow();
      setItemsPerPage(newItemsPerPage);

      const newTotalPages = Math.ceil(amountOfAchievements / newItemsPerPage);
      setTotalPages(newTotalPages);

      const startIndex = slideIndex * newItemsPerPage;
      const endIndex = Math.min(startIndex + newItemsPerPage, achievements.length);
      setAchievementsToShow(achievements.slice(startIndex, endIndex));
    }
  };

  /**
   * Determine how many achievements to show based on screen width
   *
   * @returns {number} - Number of achievements to show
   */
  const getAchievementsToShow = () => {
    const resolution = Object.keys(itemsMap)
      .map(Number)
      .sort((a, b) => b - a)
      .find(resolution => window.innerWidth >= resolution);

    return resolution !== undefined ? itemsMap[resolution] : 0;
  };

  /**
   * Change the current page of achievements
   *
   * @param {boolean} isNext - Whether to go to the next page
   */
  const changeAchievements = (isNext) => {
    if (isNext) {
      setSlideIndex((prevIndex) => (prevIndex + 1) % totalPages);
    } else {
      setSlideIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
    }
  };

  /**
   * Determine whether to show navigation arrows
   *
   * @returns {boolean} - Whether to show arrows
   */
  const shouldShowArrows = () => {
    return achievements.length > itemsPerPage && window.innerWidth < 768;
  };

  /**
   * Open the achievements modal
   */
  const openDialog = () => {
    // This would be implemented with a modal component in a real app
    console.log('Open achievements modal');
  };

  /**
   * Handle keyboard navigation
   *
   * @param {KeyboardEvent} event - Keyboard event
   * @param {boolean} isNext - Whether to go to the next page
   */
  const onKeyDown = (event, isNext) => {
    if ((event.key === 'Enter' || event.key === ' ') && shouldShowArrows()) {
      event.preventDefault();
      changeAchievements(isNext);
    }
  };

  return (
    <div className="outer">
      <div className="achievements">
        <div className="header">
          <div className="title-achievements">
            <p className="my-achievements">My Achievements</p>
            {amountOfAchievements > itemsPerPage && (
              <a onClick={openDialog}>See All</a>
            )}
          </div>
          <div>
            <div className="achieved-quantity">{amountOfAchievements} Achieved</div>
          </div>
        </div>

        {amountOfAchievements > 0 ? (
          <div className="slider-wrapper">
            <img
              ref={previousArrowRef}
              className={`achievements-previous ${!shouldShowArrows() ? 'hidden' : ''}`}
              onClick={() => changeAchievements(false)}
              onKeyDown={(e) => onKeyDown(e, false)}
              src={arrows.arrowPrevious}
              alt="arrow previous"
              tabIndex={shouldShowArrows() ? 0 : -1}
            />

            <div ref={sliderRef} className="achievements-images">
              {achievementsToShow.map((achievement) => (
                <div key={achievement.id}>
                  <img
                    src={`assets/img/profile/achievements/${achievement.achievementCategory.name}.png`}
                    alt={achievement.name}
                  />
                </div>
              ))}
            </div>

            <img
              ref={nextArrowRef}
              className={`achievements-next ${!shouldShowArrows() ? 'hidden' : ''}`}
              onClick={() => changeAchievements(true)}
              onKeyDown={(e) => onKeyDown(e, true)}
              src={arrows.arrowNext}
              alt="arrow next"
              tabIndex={shouldShowArrows() ? 0 : -1}
            />
          </div>
        ) : (
          <p className="no-achievements">No achievements yet</p>
        )}
      </div>
    </div>
  );
};

export default UsersAchievements;
