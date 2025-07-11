/**
 * Constants used in the CreateNews component
 */

/**
 * Quill editor modules configuration
 */
export const EDITOR_MODULES = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean']
  ],
};

/**
 * Quill editor formats configuration
 */
export const EDITOR_FORMATS = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'align', 'indent',
  'blockquote', 'code-block',
  'link', 'image'
];

/**
 * Maximum file size for image uploads (10MB)
 */
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

/**
 * Valid image types for upload
 */
export const VALID_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

/**
 * Text field constraints
 */
export const TEXT_CONSTRAINTS = {
  TITLE_MAX_LENGTH: 170,
  TEXT_MIN_LENGTH: 20,
  TEXT_MAX_LENGTH: 63206,
  MAX_TAGS: 3
};