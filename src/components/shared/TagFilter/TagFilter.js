import React, { useState, useEffect } from 'react';
import './TagFilter.scss';

/**
 * TagFilter component for filtering content by tags
 *
 * @param {Object} props - Component props
 * @param {Array} props.tags - Array of tag objects with name, nameUa, and isActive properties
 * @param {Function} props.onTagSelect - Callback function when tags are selected
 * @param {Array} [props.selectedTags] - Array of currently selected tag names
 * @param {string} [props.storageKey] - Key for storing selected tags in localStorage
 * @returns {JSX.Element} - Rendered component
 */
const TagFilter = ({ tags, onTagSelect, selectedTags = [], storageKey = 'tag-filter' }) => {
  // State for tracking active tags
  const [activeTags, setActiveTags] = useState(selectedTags);

  // Initialize from localStorage if available
  useEffect(() => {
    if (storageKey) {
      const savedTags = localStorage.getItem(storageKey);
      if (savedTags) {
        try {
          const parsedTags = JSON.parse(savedTags);
          setActiveTags(parsedTags);
          // Don't call onTagSelect here to avoid circular updates
        } catch (e) {
          console.error('Error parsing saved tags:', e);
        }
      }
    }
  }, [storageKey]);

  // Update when selectedTags prop changes
  useEffect(() => {
    setActiveTags(selectedTags);
  }, [selectedTags]);

  // Handle tag click
  const handleTagClick = (tagName) => {
    let newActiveTags;

    if (activeTags.includes(tagName)) {
      // Remove tag if already active
      newActiveTags = activeTags.filter(tag => tag !== tagName);
    } else {
      // Add tag if not active
      newActiveTags = [...activeTags, tagName];
    }

    // Update state
    setActiveTags(newActiveTags);

    // Save to localStorage if storageKey provided
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(newActiveTags));
    }

    // Call callback function
    onTagSelect(newActiveTags);
  };

  return (
    <div className="tag-filter">
      <div className="tag-filter-container">
        {tags.map((tag, index) => (
          <button
            key={index}
            className={`tag-button ${activeTags.includes(tag.name) ? 'active' : ''}`}
            onClick={() => handleTagClick(tag.name)}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;
