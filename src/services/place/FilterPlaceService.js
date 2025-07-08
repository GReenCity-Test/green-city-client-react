import { BehaviorSubject } from 'rxjs';
import { format } from 'date-fns';

/**
 * Service for filtering places
 */
class FilterPlaceService {
  /**
   * Whether filters are cleared
   * @type {boolean}
   */
  isCleared = true;

  /**
   * Map bounds
   * @type {import('../../models/place/PlacesFilter').MapBoundsDto}
   */
  mapBounds = {
    northEastLat: null,
    northEastLng: null,
    southWestLat: null,
    southWestLng: null
  };

  /**
   * Category
   * @type {Object}
   */
  category = null;

  /**
   * Specification
   * @type {Object}
   */
  specification = null;

  /**
   * Whether to show only places that are open now
   * @type {boolean}
   */
  isNowOpen = false;

  /**
   * Minimum discount
   * @type {number}
   */
  discountMin = 0;

  /**
   * Maximum discount
   * @type {number}
   */
  discountMax = 100;

  /**
   * Distance
   * @type {number}
   */
  distance = null;

  /**
   * User marker location
   * @type {import('../../models/place/Place').PlaceLocation}
   */
  userMarkerLocation = {
    lat: null,
    lng: null,
    id: null,
    address: null
  };

  /**
   * Subject for filters DTO
   * @type {BehaviorSubject<Object>}
   */
  filtersDto$ = new BehaviorSubject({ status: 'APPROVED' });

  /**
   * Subject for favorite filter
   * @type {BehaviorSubject<boolean>}
   */
  isFavoriteFilter$ = new BehaviorSubject(false);

  /**
   * Set category name
   *
   * @param {string} name - Category name
   */
  setCategoryName(name) {
    this.category = { name };
  }

  /**
   * Set specification name
   *
   * @param {string} name - Specification name
   */
  setSpecName(name) {
    this.specification = { name };
  }

  /**
   * Set map bounds
   *
   * @param {Object} latLngBounds - Latitude/longitude bounds
   */
  setMapBounds(latLngBounds) {
    this.mapBounds.northEastLat = latLngBounds.getNorthEast().lat();
    this.mapBounds.northEastLng = latLngBounds.getNorthEast().lng();
    this.mapBounds.southWestLat = latLngBounds.getSouthWest().lat();
    this.mapBounds.southWestLng = latLngBounds.getSouthWest().lng();
  }

  /**
   * Set discount bounds
   *
   * @param {number} discountMin - Minimum discount
   * @param {number} discountMax - Maximum discount
   */
  setDiscountBounds(discountMin, discountMax) {
    this.discountMin = discountMin;
    this.discountMax = discountMax;
    this.isCleared = false;
  }

  /**
   * Set whether to show only places that are open now
   *
   * @param {boolean} isOpen - Whether to show only places that are open now
   */
  setIsNowOpen(isOpen) {
    this.isNowOpen = isOpen;
  }

  /**
   * Get filters
   *
   * @returns {Object} Filters DTO
   */
  getFilters() {
    const discount = {
      category: this.category,
      specification: this.specification,
      discountMin: this.discountMin,
      discountMax: this.discountMax
    };

    const currentTime = this.isNowOpen ? format(new Date(), 'dd/MM/yyyy HH:mm:ss') : null;

    const distance = {
      lat: this.userMarkerLocation.lat,
      lng: this.userMarkerLocation.lng,
      distance: this.distance
    };

    return {
      status: 'APPROVED',
      mapBoundsDto: this.mapBounds,
      filterDiscountDto: discount,
      distanceFromUserDto: distance,
      searchReg: null,
      time: currentTime
    };
  }

  /**
   * Update filters DTO
   *
   * @param {import('../../models/place/PlacesFilter').PlacesFilter} placesFilter - Places filter
   */
  updateFiltersDto(placesFilter) {
    const filtersDto = {
      status: 'APPROVED',
      mapBoundsDto: placesFilter.mapBoundsDto
    };

    if (placesFilter.searchName) {
      filtersDto.searchReg = placesFilter.searchName;
    }

    if (placesFilter.moreOptionsFilters?.distance.isActive) {
      filtersDto.distanceFromUserDto = {
        distance: placesFilter.moreOptionsFilters.distance.value,
        lat: placesFilter.position.latitude,
        lng: placesFilter.position.longitude
      };
    }

    if (placesFilter.moreOptionsFilters?.baseFilters['Open now']) {
      filtersDto.time = format(new Date(), 'dd/MM/yyyy HH:mm:ss');
    }

    const servicesFilters = placesFilter.moreOptionsFilters?.servicesFilters;

    let categories = [];

    if (servicesFilters) {
      const services = Object.keys(servicesFilters).reduce((acc, key) => {
        if (servicesFilters[key]) {
          acc.push(key);
        }
        return acc;
      }, []);
      categories.push(...services, ...placesFilter.basicFilters);
      categories = this.removeNonCategoryFilters(categories);
    }

    if (categories.length) {
      filtersDto.categories = categories;
    }

    const isFavoriteFilter =
      placesFilter.moreOptionsFilters?.baseFilters['Saved places'] || placesFilter.basicFilters.includes('Saved places');
    this.isFavoriteFilter$.next(isFavoriteFilter);

    this.filtersDto$.next(filtersDto);
  }

  /**
   * Remove non-category filters
   *
   * @param {string[]} filters - Filters
   * @returns {string[]} Filters without non-category filters
   */
  removeNonCategoryFilters(filters) {
    return filters.filter((filterItem) => filterItem !== 'Saved places');
  }

  /**
   * Clear filter
   */
  clearFilter() {
    this.discountMin = 0;
    this.discountMax = 100;
    this.isCleared = true;
    this.isNowOpen = false;
    this.distance = null;
  }

  /**
   * Set distance
   *
   * @param {number} distance - Distance
   */
  setDistance(distance) {
    this.distance = distance > 0 ? distance : null;
  }

  /**
   * Set user marker location
   *
   * @param {import('../../models/place/Place').PlaceLocation} userMarkerLocation - User marker location
   */
  setUserMarkerLocation(userMarkerLocation) {
    this.userMarkerLocation = userMarkerLocation;
  }
}

export default FilterPlaceService;
