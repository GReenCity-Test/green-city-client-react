/**
 * @typedef {Object} UbsOrder
 * @property {number} id - Order ID
 * @property {string} dateForm - Order date
 * @property {string} datePaid - Payment date
 * @property {string} orderStatus - Order status (in Ukrainian)
 * @property {string} orderStatusEng - Order status (in English)
 * @property {string} paymentStatus - Payment status (in Ukrainian)
 * @property {string} paymentStatusEng - Payment status (in English)
 * @property {number} orderFullPrice - Full price of the order
 * @property {number} amountBeforePayment - Amount to be paid
 * @property {number} paidAmount - Amount already paid
 * @property {UbsBag[]} bags - Bags in the order
 * @property {string[]} certificate - Certificates applied to the order
 * @property {number} bonuses - Bonuses applied to the order
 * @property {number} refundedMoney - Money refunded
 * @property {number} refundedBonuses - Bonuses refunded
 * @property {number[]} additionalOrders - Additional orders
 * @property {string} orderComment - Comment for the order
 * @property {UbsSender} sender - Sender information
 * @property {UbsAddress} address - Address information
 */

/**
 * @typedef {Object} UbsBag
 * @property {string} service - Service name (in Ukrainian)
 * @property {string} serviceEng - Service name (in English)
 * @property {number} capacity - Capacity of the bag
 * @property {number} fullPrice - Full price of the bag
 * @property {number} count - Number of bags
 * @property {number} totalPrice - Total price of the bags
 */

/**
 * @typedef {Object} UbsSender
 * @property {string} senderName - Sender's name
 * @property {string} senderSurname - Sender's surname
 * @property {string} senderPhone - Sender's phone number
 * @property {string} senderEmail - Sender's email
 */

/**
 * @typedef {Object} UbsAddress
 * @property {string} addressCity - City (in Ukrainian)
 * @property {string} addressCityEng - City (in English)
 * @property {string} addressStreet - Street (in Ukrainian)
 * @property {string} addressStreetEng - Street (in English)
 * @property {string} houseNumber - House number
 * @property {string} houseCorpus - House corpus
 * @property {string} entranceNumber - Entrance number
 * @property {string} addressDistinct - District (in Ukrainian)
 * @property {string} addressDistinctEng - District (in English)
 * @property {string} addressComment - Comment for the address
 */

/**
 * @typedef {Object} UbsBonus
 * @property {string} dateOfEnrollment - Date when the bonus was enrolled
 * @property {number} amount - Amount of bonuses
 * @property {string} reasonUa - Reason for the bonus (in Ukrainian)
 * @property {string} reasonEn - Reason for the bonus (in English)
 * @property {number} numberOfOrder - Order number related to the bonus
 */

/**
 * @typedef {Object} UbsMessage
 * @property {number} id - Message ID
 * @property {number} orderId - Order ID
 * @property {string} title - Message title
 * @property {string} body - Message body
 * @property {string} notificationTime - Time when the message was sent
 * @property {boolean} read - Whether the message has been read
 * @property {string[]} images - Images attached to the message
 */

/**
 * @typedef {Object} UbsProfile
 * @property {string} recipientName - Recipient's name
 * @property {string} recipientSurname - Recipient's surname
 * @property {string} recipientEmail - Recipient's email
 * @property {string} alternateEmail - Alternate email
 * @property {string} recipientPhone - Recipient's phone number
 * @property {boolean} telegramIsNotify - Whether to notify via Telegram
 * @property {UbsProfileAddress[]} addressDto - Addresses
 */

/**
 * @typedef {Object} UbsProfileAddress
 * @property {number} id - Address ID
 * @property {string} region - Region (in Ukrainian)
 * @property {string} regionEn - Region (in English)
 * @property {string} city - City (in Ukrainian)
 * @property {string} cityEn - City (in English)
 * @property {string} street - Street (in Ukrainian)
 * @property {string} streetEn - Street (in English)
 * @property {string} houseNumber - House number
 * @property {string} houseCorpus - House corpus
 * @property {string} entranceNumber - Entrance number
 * @property {string} district - District (in Ukrainian)
 * @property {string} districtEn - District (in English)
 * @property {string} addressComment - Comment for the address
 * @property {boolean} actual - Whether this is the default address
 */

// This file is just for type definitions, no exports needed
