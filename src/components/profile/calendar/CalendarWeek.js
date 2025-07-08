import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import HabitAssignService from '../../../services/habit/HabitAssignService';
import HabitsPopup from './habits-popup/HabitsPopup';
import './CalendarWeek.scss';

// Arrow icons
const arrowPrevious = '/assets/img/arrow_left.svg';
const arrowNext = '/assets/img/arrow_right.svg';

/**
 * Component for displaying a weekly calendar view with habit tracking
 */
const CalendarWeek = () => {
  const { t, i18n } = useTranslation();
  const [currentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  const [weekTitle, setWeekTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for habit popup
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [habitsForSelectedDay, setHabitsForSelectedDay] = useState([]);
  const [isHabitListEditable, setIsHabitListEditable] = useState(false);
  const calendarRef = useRef(null);

  useEffect(() => {
    buildWeekCalendar(getFirstWeekDate());
    getUserHabits();
  }, [i18n.language]);

  /**
   * Get the first date of the current week (Monday)
   * @returns {Date} First date of the week
   */
  const getFirstWeekDate = () => {
    const day =
      currentDate.getDay() === 0
        ? currentDate.getDate() - 6
        : currentDate.getDate() - currentDate.getDay() + 1;
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    return new Date(year, month, day);
  };

  /**
   * Build the week calendar starting from the given date
   * @param {Date} firstWeekDay - First day of the week
   */
  const buildWeekCalendar = (firstWeekDay) => {
    const year = firstWeekDay.getFullYear();
    const month = firstWeekDay.getMonth();
    const day = firstWeekDay.getDate();
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(year, month, day + i);
      const isCurrent =
        date.getFullYear() === currentDate.getFullYear() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getDate() === currentDate.getDate();

      dates.push({
        date,
        dayName: setDayName(date),
        isCurrent,
        hasHabitsInProgress: false,
        areHabitsDone: false,
        numberOfDate: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
      });
    }

    setWeekDates(dates);
    buildWeekCalendarTitle(dates);
  };

  /**
   * Set the day name for a given date
   * @param {Date} source - Date to get day name for
   * @returns {string} Day name
   */
  const setDayName = (source) => {
    return source.toLocaleDateString(i18n.language === 'ua' ? 'uk-UA' : 'en-US', { weekday: 'short' });
  };

  /**
   * Build the week calendar title (e.g., "1 - 7 January 2023")
   * @param {Array} dates - Week dates
   */
  const buildWeekCalendarTitle = (dates) => {
    const language = i18n.language === 'ua' ? 'uk-UA' : 'en-US';
    const firstDay = dates[0].date.getDate();
    const lastDay = dates[6].date.getDate();
    const firstDayMonth = dates[0].date.toLocaleDateString(language, { month: 'long' });
    const lastDayMonth = dates[6].date.toLocaleDateString(language, { month: 'long' });
    const firstDayYear = dates[0].date.getFullYear();
    const lastDayYear = dates[6].date.getFullYear();

    let title;
    if (firstDayYear !== lastDayYear) {
      title = `${firstDay} ${firstDayMonth} ${firstDayYear} - ${lastDay} ${lastDayMonth} ${lastDayYear}`;
    } else if (firstDayMonth !== lastDayMonth) {
      title = `${firstDay} ${firstDayMonth} - ${lastDay} ${lastDayMonth} ${firstDayYear}`;
    } else {
      title = `${firstDay} - ${lastDay} ${firstDayMonth} ${firstDayYear}`;
    }

    setWeekTitle(title);
  };

  /**
   * Change the week (previous or next)
   * @param {boolean} isNext - Whether to go to the next week
   */
  const changeWeek = (isNext) => {
    const year = weekDates[0].date.getFullYear();
    const month = weekDates[0].date.getMonth();
    const day = weekDates[0].date.getDate() + (isNext ? 7 : -7);
    const firstWeekDate = new Date(year, month, day);

    buildWeekCalendar(firstWeekDate);
    getUserHabits();
  };

  /**
   * Format a date for API requests
   * @param {Object} dayItem - Day item
   * @returns {string} Formatted date (YYYY-MM-DD)
   */
  const formatDate = (dayItem) => {
    return `${dayItem.date.getFullYear()}-${
      (dayItem.date.getMonth() + 1) < 10 ? '0' + (dayItem.date.getMonth() + 1) : (dayItem.date.getMonth() + 1)
    }-${
      dayItem.date.getDate() < 10 ? '0' + dayItem.date.getDate() : dayItem.date.getDate()
    }`;
  };

  /**
   * Get user habits for the current week
   */
  const getUserHabits = async () => {
    if (!weekDates.length) return;

    try {
      setLoading(true);
      const startDate = formatDate(weekDates[0]);
      const endDate = formatDate(weekDates[6]);

      const habitsByPeriod = await HabitAssignService.getAssignHabitsByPeriod(startDate, endDate, i18n.language);

      // Update weekDates with habit information
      const updatedWeekDates = weekDates.map(day => {
        const date = formatDate(day);
        if (new Date().setHours(0, 0, 0, 0) >= new Date(date).setHours(0, 0, 0, 0)) {
          const filteredHabits = habitsByPeriod.filter(habit => habit.enrollDate === date);
          if (filteredHabits.length > 0) {
            const habit = filteredHabits[0];
            return {
              ...day,
              hasHabitsInProgress: habit.habitAssigns.length > 0,
              areHabitsDone: habit.habitAssigns.filter(h => !h.enrolled).length === 0
            };
          }
        }
        return day;
      });

      setWeekDates(updatedWeekDates);
      setError(null);
    } catch (err) {
      console.error('Error getting habits by period:', err);
      setError('Failed to load habits. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Show habits for a specific day
   * @param {Event} event - Click event
   * @param {Object} dayItem - Day item
   */
  const showHabits = async (event, dayItem) => {
    if (checkCanOpenPopup(dayItem)) {
      try {
        // Get habits for the selected day
        const date = formatDate(dayItem);
        const habitsByPeriod = await HabitAssignService.getAssignHabitsByPeriod(date, date, i18n.language);

        // Find habits for the selected day
        const habitsForDay = habitsByPeriod.find(habit => habit.enrollDate === date);

        if (habitsForDay && habitsForDay.habitAssigns.length > 0) {
          // Check if habits can be edited (not older than 7 days)
          const currentDate = new Date();
          const selectedDate = new Date(date);
          const daysDifference = Math.floor((currentDate - selectedDate) / (1000 * 60 * 60 * 24));
          const isEditable = daysDifference > 7;

          // Set state for popup
          setSelectedDay(date);
          setHabitsForSelectedDay(habitsForDay.habitAssigns);
          setIsHabitListEditable(isEditable);

          // Calculate position for popup
          const rect = event.currentTarget.getBoundingClientRect();
          const calendarRect = calendarRef.current.getBoundingClientRect();

          // Position popup below the day
          let top = rect.bottom - calendarRect.top + 10;
          let left = rect.left - calendarRect.left;

          // Adjust position if popup would go off screen
          const popupWidth = 314; // Width from CSS
          if (left + popupWidth > window.innerWidth) {
            left = window.innerWidth - popupWidth - 20;
          }

          setPopupPosition({ top, left });
          setShowPopup(true);
        }
      } catch (err) {
        console.error('Error getting habits for day:', err);
      }
    }
  };

  /**
   * Handle toggling a habit's enrollment status
   * @param {number} habitId - Habit ID
   */
  const handleHabitToggle = async (habitId) => {
    try {
      // Find the habit in the list
      const habitIndex = habitsForSelectedDay.findIndex(habit => habit.habitAssignId === habitId);
      if (habitIndex === -1) return;

      const habit = habitsForSelectedDay[habitIndex];
      const updatedHabit = { ...habit, enrolled: !habit.enrolled };

      // Update the habit in the API
      if (updatedHabit.enrolled) {
        await HabitAssignService.enrollByHabit(habitId, selectedDay, i18n.language);
      } else {
        await HabitAssignService.unenrollByHabit(habitId, selectedDay);
      }

      // Update the local state
      const updatedHabits = [...habitsForSelectedDay];
      updatedHabits[habitIndex] = updatedHabit;
      setHabitsForSelectedDay(updatedHabits);

      // Update the week dates to reflect the change
      getUserHabits();
    } catch (err) {
      console.error('Error toggling habit:', err);
    }
  };

  /**
   * Close the habit popup
   */
  const closePopup = () => {
    setShowPopup(false);
  };

  /**
   * Check if a popup can be opened for a day
   * @param {Object} dayItem - Day item
   * @returns {boolean} Whether a popup can be opened
   */
  const checkCanOpenPopup = (dayItem) => {
    return !!dayItem.hasHabitsInProgress;
  };

  /**
   * Get the CSS class for a day based on its state
   * @param {Object} day - Day item
   * @returns {string} CSS class
   */
  const getDayClass = (day) => {
    if (day.isCurrent) {
      return 'current-number';
    } else if (day.hasHabitsInProgress && day.areHabitsDone) {
      return 'enrolled-day';
    } else if (day.hasHabitsInProgress && !day.areHabitsDone) {
      return 'unenrolled-day';
    }
    return '';
  };

  if (loading && weekDates.length === 0) {
    return (
      <div className="calendar-week">
        <div className="loading">Loading calendar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-week">
        <div className="error">{error}</div>
        <button onClick={getUserHabits} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="calendar-week" ref={calendarRef}>
      <div className="title">
        <button onClick={() => changeWeek(false)}>
          <img className="arrow-previous" src={arrowPrevious} alt="arrow previous" />
        </button>
        <div className="week">{weekTitle}</div>
        <button onClick={() => changeWeek(true)}>
          <img className="arrow-next" src={arrowNext} alt="arrow next" />
        </button>
      </div>
      <div className="body">
        <div className="day-name-row">
          {weekDates.map((day, index) => (
            <div
              key={`day-name-${index}`}
              className={`day-name ${day.isCurrent ? 'current-name' : ''}`}
            >
              {day.dayName.toUpperCase()}
            </div>
          ))}
        </div>
        <div className="day-number-row">
          {weekDates.map((day, index) => (
            <div
              key={`day-number-${index}`}
              className={`day-number ${getDayClass(day)}`}
              onClick={(e) => showHabits(e, day)}
            >
              {day.date.getDate()}
            </div>
          ))}
        </div>
      </div>

      {/* Habits Popup */}
      {showPopup && selectedDay && (
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`
            }}
          >
            <HabitsPopup
              selectedDate={selectedDay}
              habits={habitsForSelectedDay}
              isEditable={isHabitListEditable}
              onClose={closePopup}
              onHabitToggle={handleHabitToggle}
            />
          </div>
          <div
            className="popup-backdrop"
            onClick={closePopup}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarWeek;
