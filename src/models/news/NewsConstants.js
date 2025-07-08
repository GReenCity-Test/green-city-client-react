/**
 * @typedef {Object} FilterModel
 * @property {string} name - The name of the filter
 * @property {string} nameUa - The Ukrainian name of the filter
 * @property {boolean} isActive - Whether the filter is active
 */

/**
 * Array of tags for eco-news articles
 * @type {FilterModel[]}
 */
export const tagsListEcoNewsData = [
  {
    name: 'News',
    nameUa: 'Новини',
    isActive: false
  },
  {
    name: 'Events',
    nameUa: 'Події',
    isActive: false
  },
  {
    name: 'Education',
    nameUa: 'Освіта',
    isActive: false
  },
  {
    name: 'Initiatives',
    nameUa: 'Ініціативи',
    isActive: false
  },
  {
    name: 'Ads',
    nameUa: 'Реклама',
    isActive: false
  }
];
