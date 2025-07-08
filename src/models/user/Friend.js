/**
 * @typedef {Object} FriendModel
 * @property {number} id - Unique identifier
 * @property {string} name - Friend's name
 * @property {string} email - Friend's email
 * @property {string} [profilePicturePath] - Path to friend's profile picture
 * @property {boolean} [added] - Whether the friend has been added
 * @property {number} rating - Friend's rating
 * @property {Object} [userLocationDto] - Friend's location information
 * @property {number} [mutualFriends] - Number of mutual friends
 * @property {FriendStatus} friendStatus - Status of the friendship
 * @property {number|null} requesterId - ID of the user who sent the friend request
 * @property {number} [chatId] - ID of the chat with the friend
 * @property {boolean} [isOnline] - Whether the friend is online
 * @property {Object} [friendsChatDto] - Chat information
 * @property {boolean} [hasInvitation] - Whether the friend has an invitation
 * @property {boolean} [hasAcceptedInvitation] - Whether the friend has accepted an invitation
 */

/**
 * @typedef {('FRIEND'|'REQUEST'|'REJECTED'|null)} FriendStatus
 */

/**
 * Friend status values
 * @readonly
 * @enum {FriendStatus}
 */
export const FriendStatusValues = {
  FRIEND: 'FRIEND',
  REQUEST: 'REQUEST',
  REJECTED: 'REJECTED',
  NONE: null
};

/**
 * @typedef {Object} FriendArrayModel
 * @property {number} totalElements - Total number of friends
 * @property {number} totalPages - Total number of pages
 * @property {number} currentPage - Current page number
 * @property {FriendModel[]} page - Array of friends on the current page
 */

/**
 * @typedef {Object} FriendProfilePicturesArrayModel
 * @property {number} id - Unique identifier
 * @property {string} name - Friend's name
 * @property {string} profilePicturePath - Path to friend's profile picture
 */

/**
 * @typedef {Object} UserDataAsFriend
 * @property {number} id - Unique identifier
 * @property {FriendStatus} friendStatus - Status of the friendship
 * @property {number|null} requesterId - ID of the user who sent the friend request
 * @property {number} [chatId] - ID of the chat with the friend
 */

/**
 * @typedef {Object} UserOnlineStatus
 * @property {number} id - Unique identifier
 * @property {boolean} onlineStatus - Whether the user is online
 */

// Export default empty object to satisfy ESLint
export default {};
