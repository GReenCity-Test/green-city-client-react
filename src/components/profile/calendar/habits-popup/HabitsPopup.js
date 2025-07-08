import React from 'react';
import PropTypes from 'prop-types';
import './HabitsPopup.scss';

// Icons for habit status
const checkCircle = '/assets/img/check_circle.svg';
const plusCircle = '/assets/img/plus_circle.svg';

/**
 * Component for displaying a popup with habits for a specific date
 */
const HabitsPopup = ({
  selectedDate,
  habits,
  isEditable,
  onClose,
  onHabitToggle
}) => {
  // Format the selected date for display
  const formatDate = (date) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Check if a tooltip should be shown for a habit name
  const showTooltip = (habitName) => {
    return habitName.length > 30;
  };

  // Handle toggling a habit's enrollment status
  const handleToggleHabit = (habitId) => {
    if (!isEditable) {
      onHabitToggle(habitId);
    }
  };

  return (
    <div className="calendar-habits-popup">
      <div className="habits-popup-content">
        <p className="habits-title">{formatDate(selectedDate)}</p>
        <ul className={`habits-list ${isEditable ? 'disabled' : ''}`}>
          {habits.map((habit) => (
            <li key={habit.habitAssignId} className="habits-item">
              <img
                className="habit-icon"
                src={habit.enrolled ? checkCircle : plusCircle}
                alt={habit.enrolled ? 'Enrolled' : 'Not enrolled'}
                onClick={() => handleToggleHabit(habit.habitAssignId)}
              />
              <span
                title={showTooltip(habit.habitName) ? habit.habitName : ''}
              >
                {habit.habitName}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

HabitsPopup.propTypes = {
  selectedDate: PropTypes.string.isRequired,
  habits: PropTypes.arrayOf(
    PropTypes.shape({
      habitAssignId: PropTypes.number.isRequired,
      habitName: PropTypes.string.isRequired,
      enrolled: PropTypes.bool.isRequired
    })
  ).isRequired,
  isEditable: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onHabitToggle: PropTypes.func.isRequired
};

HabitsPopup.defaultProps = {
  isEditable: false
};

export default HabitsPopup;
