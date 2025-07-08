/**
 * @typedef {import('../models/VisionCard').VisionCard} VisionCard
 */

import { ABOUT_IMAGES, BASE_PATHS } from '../../../constants/imagePaths';

/**
 * Array of vision cards for the about page
 * @type {VisionCard[]}
 */
export const visionCards = [
  {
    id: 1,
    title: 'Find Eco Stores',
    description: 'Discover eco-friendly stores and businesses in your area that promote sustainable products and practices.',
    linkText: 'Find Stores',
    linkPath: ['/places'],
    imgUrl: ABOUT_IMAGES.ILLUSTRATION_STORE,
    alt: 'illustration store',
    navigationExtras: {
      routerActiveLinkOptions: {
        exact: true
      },
      fragment: 'top-user-bar'
    }
  },
  {
    id: 2,
    title: 'Save Money',
    description: 'Learn how eco-friendly habits can help you save money while contributing to a healthier planet.',
    linkText: 'Learn More',
    linkPath: [],
    imgUrl: ABOUT_IMAGES.ILLUSTRATION_MONEY,
    alt: 'illustration money'
  },
  {
    id: 3,
    title: 'Recycle Properly',
    description: 'Understand how to recycle correctly and make the most impact with your waste reduction efforts.',
    linkText: 'Recycling Guide',
    linkPath: [],
    imgUrl: ABOUT_IMAGES.ILLUSTRATION_RECYCLE,
    alt: 'illustration recycle'
  },
  {
    id: 4,
    title: 'Join the Community',
    description: 'Connect with like-minded individuals who are passionate about sustainable living and environmental protection.',
    linkText: 'Get Involved',
    linkPath: [],
    imgUrl: ABOUT_IMAGES.ILLUSTRATION_PEOPLE,
    alt: 'illustration people'
  }
].map((obj) => ({ ...obj, numberImg: `${BASE_PATHS.PUBLIC}${obj.id}` }));
