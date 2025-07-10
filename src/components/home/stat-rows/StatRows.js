import React, { useState, useEffect } from 'react';
import StatRow from './StatRow';
import './StatRows.scss';

const StatRows = () => {
  const [homePageHabitStats, setHomePageHabitStats] = useState([]);

  useEffect(() => {
    // TODO: Replace with actual API call to get habit statistics
    // Mock data for now
    const mockHabitStats = [
      {
        action: 'Did not take',
        caption: 'bags',
        count: 1234,
        question: 'And how many packages did you not take today?',
        iconPath: 'assets/img/habit-pic-bag.png',
        locationText: 'you can buy eco-bags here'
      },
      {
        action: 'Did not throw away',
        caption: 'cups',
        count: 5678,
        question: 'And how many cups did you not throw away today?',
        iconPath: 'assets/img/habit-pic-cup.png',
        locationText: 'places that make a discount on a drink in your cup'
      }
    ];

    setHomePageHabitStats(mockHabitStats);
  }, []);

  return (
    <div id="stat-rows">
      {homePageHabitStats.map((stat, index) => (
        <StatRow key={`${stat.action}-${stat.caption}`} stat={stat} index={index + 1} />
      ))}
    </div>
  );
};

export default StatRows;
