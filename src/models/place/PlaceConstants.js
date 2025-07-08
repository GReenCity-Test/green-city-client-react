/**
 * @typedef {Object} FilterModel
 * @property {string} name - Filter name
 * @property {string} nameUa - Ukrainian filter name
 * @property {boolean} isActive - Whether the filter is active
 */

/**
 * Array of place categories for filtering
 * @type {FilterModel[]}
 */
export const tagsListPlacesData = [
  {
    name: 'Shops',
    nameUa: 'Магазини',
    isActive: false
  },
  {
    name: 'Restaurants',
    nameUa: 'Ресторани',
    isActive: false
  },
  {
    name: 'Recycling points',
    nameUa: 'Пункти приймання',
    isActive: false
  },
  {
    name: 'Events',
    nameUa: 'Події',
    isActive: false
  },
  {
    name: 'Saved places',
    nameUa: 'Збереженні місця',
    isActive: false
  }
];

/**
 * Array of base filters for places
 * @type {FilterModel[]}
 */
export const baseFiltersForPlaces = [
  {
    name: 'Open now',
    nameUa: 'Відкрито зараз',
    isActive: false
  },
  {
    name: 'Special offers',
    nameUa: 'Спеціальні пропозиції',
    isActive: false
  }
];

/**
 * Array of service-specific filters for places
 * @type {FilterModel[]}
 */
export const servicesFiltersForPlaces = [
  {
    name: 'Vegan products',
    nameUa: 'Веганські продукти',
    isActive: false
  },
  {
    name: 'Bike rentals',
    nameUa: 'Прокат велосипедів',
    isActive: false
  },
  {
    name: 'Bike parking',
    nameUa: 'Стоянка для велосипедів',
    isActive: false
  },
  {
    name: 'Hotels',
    nameUa: 'Готелі',
    isActive: false
  },
  {
    name: 'Charging station',
    nameUa: 'Зарядна станція',
    isActive: false
  },
  {
    name: 'Cycling routes',
    nameUa: 'Велосипедні маршрути',
    isActive: false
  }
];
