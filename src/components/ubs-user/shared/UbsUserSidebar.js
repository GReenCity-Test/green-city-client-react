import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './UbsUserSidebar.scss';

// Icons for sidebar navigation
const sidebarIcons = {
  orders: '/assets/img/sidebarIcons/shopping-cart_icon.svg',
  bonuses: '/assets/img/sidebarIcons/achievement_icon.svg',
  profile: '/assets/img/sidebarIcons/workers_icon.svg',
  messages: '/assets/img/sidebarIcons/none_notification_Bell.svg'
};

/**
 * UBS User Sidebar component
 * Provides navigation for the UBS User Cabinet
 */
const UbsUserSidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();

  // Navigation items for desktop
  const desktopNavItems = [
    {
      path: '/ubs-user/orders',
      icon: sidebarIcons.orders,
      label: t('ubs-user.orders')
    },
    {
      path: '/ubs-user/bonuses',
      icon: sidebarIcons.bonuses,
      label: t('ubs-user.invoice')
    },
    {
      path: '/ubs-user/profile',
      icon: sidebarIcons.profile,
      label: t('ubs-user.user_data')
    },
    {
      path: '/ubs-user/messages',
      icon: sidebarIcons.messages,
      label: t('ubs-user.messages')
    }
  ];

  // Navigation items for mobile (different order)
  const mobileNavItems = [
    {
      path: '/ubs-user/profile',
      icon: sidebarIcons.profile,
      label: t('ubs-user.user')
    },
    {
      path: '/ubs-user/bonuses',
      icon: sidebarIcons.bonuses,
      label: t('ubs-user.invoice')
    },
    {
      path: '/ubs-user/messages',
      icon: sidebarIcons.messages,
      label: t('ubs-user.messages')
    },
    {
      path: '/ubs-user/orders',
      icon: sidebarIcons.orders,
      label: t('ubs-user.orders')
    }
  ];

  // Determine if we're on mobile based on screen width
  const isMobile = window.innerWidth < 768;
  const navItems = isMobile ? mobileNavItems : desktopNavItems;

  return (
    <div className="ubs-user-sidebar">
      <h3>{t('ubs-user.cabinet')}</h3>
      <ul className={isMobile ? 'mobile-nav' : ''}>
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <img src={item.icon} alt={item.label} className="nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UbsUserSidebar;
