/**
 * @typedef {Object} MapBoundsDto
 * @property {number} northEastLat - North-east latitude
 * @property {number} northEastLng - North-east longitude
 * @property {number} southWestLat - South-west latitude
 * @property {number} southWestLng - South-west longitude
 */

/**
 * @typedef {Object} MoreOptionsFormValue
 * @property {Object} baseFilters - Base filters
 * @property {boolean} baseFilters['Open now'] - Whether to show only places that are open now
 * @property {boolean} baseFilters['Special offers'] - Whether to show only places with special offers
 * @property {boolean} baseFilters['Saved places'] - Whether to show only saved places
 * @property {Object} servicesFilters - Service-specific filters
 * @property {boolean} servicesFilters['Vegan products'] - Whether to show only places with vegan products
 * @property {boolean} servicesFilters['Bike rentals'] - Whether to show only places with bike rentals
 * @property {boolean} servicesFilters['Bike parking'] - Whether to show only places with bike parking
 * @property {boolean} servicesFilters['Hotels'] - Whether to show only hotels
 * @property {boolean} servicesFilters['Charging station'] - Whether to show only places with charging stations
 * @property {boolean} servicesFilters['Cycling routes'] - Whether to show only places with cycling routes
 * @property {Object} distance - Distance filter
 * @property {boolean} distance.isActive - Whether the distance filter is active
 * @property {number} distance.value - Distance value
 */

/**
 * @typedef {Object} PlacesFilter
 * @property {string} searchName - Search term
 * @property {MoreOptionsFormValue} moreOptionsFilters - More options filters
 * @property {string[]} basicFilters - Basic filters
 * @property {MapBoundsDto} mapBoundsDto - Map bounds
 * @property {Object} position - User's position
 * @property {number} position.latitude - Latitude
 * @property {number} position.longitude - Longitude
 */

// This file is just for type definitions, no exports needed
