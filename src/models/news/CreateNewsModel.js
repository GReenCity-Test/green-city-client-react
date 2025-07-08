/**
 * @typedef {Object} NewsModel
 * @property {string} text - The text content of the news article
 * @property {string} title - The title of the news article
 */

/**
 * @typedef {Object} LanguageModel
 * @property {string} name - The name of the language
 * @property {string} lang - The language code
 */

/**
 * @typedef {Object} TranslationModel
 * @property {string} text - The translated text content
 * @property {string} title - The translated title
 */

/**
 * @typedef {Object} TranslationDTO
 * @property {Object} language - The language information
 * @property {string} language.code - The language code
 * @property {string} text - The translated text content
 * @property {string} title - The translated title
 */

/**
 * @typedef {Object} NewsDTO
 * @property {string} [id] - The ID of the news article
 * @property {Array<Object>} tags - The tags associated with the news article
 * @property {string} text - The text content of the news article
 * @property {string} title - The title of the news article
 * @property {string} source - The source of the news article
 * @property {string} [image] - The image URL of the news article
 * @property {string} [content] - The content of the news article
 * @property {number} countOfEcoNews - The count of eco-news articles
 */

/**
 * @typedef {Object} NewsResponseDTO
 * @property {number} id - The ID of the news article
 * @property {string} title - The title of the news article
 * @property {string} text - The text content of the news article
 * @property {Object} ecoNewsAuthorDto - The author information
 * @property {number} ecoNewsAuthorDto.id - The ID of the author
 * @property {string} ecoNewsAuthorDto.firstName - The first name of the author
 * @property {string} ecoNewsAuthorDto.lastName - The last name of the author
 * @property {string} creationDate - The creation date of the news article
 * @property {string} imagePath - The image path of the news article
 * @property {Array<string>} tags - The tags associated with the news article
 */

/**
 * @typedef {Object} FileHandle
 * @property {File} file - The file object
 * @property {string} url - The URL of the file
 */

/**
 * @typedef {Object} QueryParams
 * @property {number} id - The ID of the news article
 */

/**
 * @typedef {Object} TextAreasHeight
 * @property {number} minTextAreaScrollHeight - The minimum scroll height of the text area
 * @property {number} maxTextAreaScrollHeight - The maximum scroll height of the text area
 * @property {string} minTextAreaHeight - The minimum height of the text area
 * @property {string} maxTextAreaHeight - The maximum height of the text area
 */

// This file is just for type definitions, no exports needed
