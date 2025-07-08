/**
 * @typedef {Object} PlaceLocation
 * @property {number} lat - Latitude
 * @property {number} lng - Longitude
 * @property {number} id - Location ID
 * @property {string} address - Address
 */

/**
 * @typedef {Object} Place
 * @property {number} id - Place ID
 * @property {string} name - Place name
 * @property {PlaceLocation} location - Place location
 * @property {boolean} [favorite] - Whether the place is a favorite
 */

/**
 * @typedef {Object} FilterPlaceCategory
 * @property {number} id - Category ID
 * @property {string} name - Category name
 * @property {string} nameUa - Ukrainian category name
 */

/**
 * @typedef {Object} PlaceAuthor
 * @property {string} email - Author email
 * @property {number} id - Author ID
 * @property {string} name - Author name
 */

/**
 * @typedef {Object} PlaceCategory
 * @property {string} name - Category name
 * @property {string} nameUa - Ukrainian category name
 * @property {number} parentCategoryId - Parent category ID
 */

/**
 * @typedef {Object} OpeningHours
 * @property {Object} breakTime - Break time
 * @property {string} breakTime.endTime - Break end time
 * @property {string} breakTime.startTime - Break start time
 * @property {Object} closeTime - Closing time
 * @property {number} closeTime.hour - Hour
 * @property {number} closeTime.minute - Minute
 * @property {number} closeTime.nano - Nanosecond
 * @property {number} closeTime.second - Second
 * @property {number} id - Opening hours ID
 * @property {Object} openTime - Opening time
 * @property {number} openTime.hour - Hour
 * @property {number} openTime.minute - Minute
 * @property {number} openTime.nano - Nanosecond
 * @property {number} openTime.second - Second
 * @property {string} weekDay - Day of the week
 */

/**
 * @typedef {Object} PlaceDetails
 * @property {PlaceAuthor} author - Place author
 * @property {PlaceCategory} category - Place category
 * @property {number} id - Place ID
 * @property {PlaceLocation} location - Place location
 * @property {string} modifiedDate - Last modified date
 * @property {string} name - Place name
 * @property {OpeningHours[]} openingHoursList - Opening hours
 * @property {string} status - Place status
 * @property {boolean} isFavorite - Whether the place is a favorite
 */

// This file is just for type definitions, no exports needed
