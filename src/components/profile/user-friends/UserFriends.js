import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import FriendService from '../../../services/user/FriendService';
import UserProfileImage from '../../shared/user-profile-image/UserProfileImage';
import './UserFriends.scss';

// Arrow icons
const arrowPrevious = '/assets/img/arrow_left.svg';
const arrowNext = '/assets/img/arrow_right.svg';

/**
 * Component for displaying a user's friends
 */
const UserFriends = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [usersFriends, setUsersFriends] = useState([]);
  const [amountOfFriends, setAmountOfFriends] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [friendsToShow, setFriendsToShow] = useState(6);
  const [onlineStatus, setOnlineStatus] = useState({});

  const nextArrowRef = useRef(null);
  const previousArrowRef = useRef(null);
  const sliderRef = useRef(null);

  // Map of items to show based on screen width
  const itemsMap = { 768: 6, 576: 5, 320: 3, 220: 1 };

  useEffect(() => {
    calculateFriendsToShow();
    showUsersFriends();

    // Add resize event listener
    const handleResize = () => {
      calculateFriendsToShow();
    };

    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [slideIndex, friendsToShow]);

  /**
   * Calculate how many friends to show based on screen width
   */
  const calculateFriendsToShow = () => {
    const newFriendsToShow = getFriendsToShow();
    if (newFriendsToShow === friendsToShow) {
      return;
    }

    setFriendsToShow(newFriendsToShow);

    if (newFriendsToShow > amountOfFriends) {
      changeFriends(false);
    }
  };

  /**
   * Get number of friends to show based on screen width
   * @returns {number} Number of friends to show
   */
  const getFriendsToShow = () => {
    const resolution = Object.keys(itemsMap)
      .map(Number)
      .sort((a, b) => b - a)
      .find(resolution => window.innerWidth >= resolution);

    return resolution !== undefined ? itemsMap[resolution] : 0;
  };

  /**
   * Fetch user's friends
   */
  const showUsersFriends = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const response = await FriendService.getAllFriends(slideIndex, friendsToShow);

      setTotalPages(response.totalPages);
      setUsersFriends(response.page);
      setAmountOfFriends(response.totalElements);

      // Check online status for each friend
      const friendIds = response.page.map(friend => friend.id);
      checkOnlineStatus(friendIds);

      updateArrowsVisibility();
    } catch (error) {
      console.error('Error fetching friends:', error);
      setError('Failed to load friends. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check online status for a list of user IDs
   * @param {number[]} userIds - User IDs to check
   */
  const checkOnlineStatus = async (userIds) => {
    try {
      const statusPromises = userIds.map(id => FriendService.isUserOnline(id));
      const statuses = await Promise.all(statusPromises);

      const newOnlineStatus = {};
      userIds.forEach((id, index) => {
        newOnlineStatus[id] = statuses[index];
      });

      setOnlineStatus(newOnlineStatus);
    } catch (error) {
      console.error('Error checking online status:', error);
    }
  };

  /**
   * Navigate to friend's profile
   * @param {Object} friend - Friend to navigate to
   */
  const showFriendsInfo = (friend) => {
    navigate(`/profile/${currentUser.id}/friends/${friend.name}/${friend.id}`);
  };

  /**
   * Change the displayed friends (previous or next page)
   * @param {boolean} isNext - Whether to go to the next page
   */
  const changeFriends = (isNext) => {
    if (isNext) {
      setSlideIndex((slideIndex + 1) % totalPages);
    } else if (slideIndex > 0) {
      setSlideIndex((slideIndex - 1) % totalPages);
    } else {
      setSlideIndex(totalPages - 1);
    }
  };

  /**
   * Update the visibility of the navigation arrows
   */
  const updateArrowsVisibility = () => {
    if (!nextArrowRef.current || !previousArrowRef.current) return;

    const show = friendsToShow < amountOfFriends && window.innerWidth < 768 ? 'visible' : 'hidden';
    nextArrowRef.current.style.visibility = show;
    previousArrowRef.current.style.visibility = show;
  };

  /**
   * Check if a friend is online
   * @param {number} friendId - Friend ID
   * @returns {boolean} Whether the friend is online
   */
  const isFriendOnline = (friendId) => {
    return onlineStatus[friendId] || false;
  };

  /**
   * Truncate text to a maximum length
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text
   */
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    const words = text.split(' ');
    return words[0].length > maxLength ? words[0].substring(0, maxLength) + '...' : words[0];
  };

  if (loading && !usersFriends.length) {
    return (
      <div className="main-container outer">
        <div className="friends">
          <div className="loading">Loading friends...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-container outer">
        <div className="friends">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container outer">
      {amountOfFriends > 0 ? (
        <div className="friends">
          <div className="friends-text">
            <div className="text-main-content">
              <p className="text-title">
                {t('profile.my-eco-friends')}
              </p>
              <Link className="text-more" to={`/profile/${currentUser?.id}/friends`}>
                {t('profile.see-all')}
              </Link>
            </div>
            <div>
              <span className="text-number">
                {amountOfFriends} {t('profile.friends-quantity', { count: amountOfFriends })}
              </span>
            </div>
          </div>
          <div className="slider-wrapper">
            <img
              ref={previousArrowRef}
              className="friends-previous"
              onClick={() => changeFriends(false)}
              src={arrowPrevious}
              alt="arrow previous"
            />
            <div ref={sliderRef} className="friends-images">
              {usersFriends.map(friend => (
                <div key={friend.id} onClick={() => showFriendsInfo(friend)}>
                  <UserProfileImage
                    imgPath={friend.profilePicturePath}
                    firstName={friend.name}
                    className="friend-img"
                    additionalImgClass="friend-user-profile"
                    isOnline={isFriendOnline(friend.id)}
                  />
                  <p className="friend-name">{truncateText(friend.name, 10)}</p>
                </div>
              ))}
            </div>
            <img
              ref={nextArrowRef}
              className="friends-next"
              onClick={() => changeFriends(true)}
              src={arrowNext}
              alt="arrow next"
            />
          </div>
        </div>
      ) : (
        <div className="friends-error">
          <div className="text-title">
            <p>{t('profile.my-eco-friends')}</p>
            <span className="text-number">0 {t('profile.friends-quantity', { count: 0 })}</span>
            <div className="error-message">
              <div className="add-friends">
                <Link to={`/profile/${currentUser?.id}/friends/recommended`}>+</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFriends;
