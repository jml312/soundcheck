/**
 * @param {string} text - text to truncate
 * @param {number} length - length to truncate to
 * @returns {string} truncated text
 */
export const truncateText = (text, length) => {
  if (!length || text?.length <= length || !text) {
    return text;
  }
  return text.substring(0, length) + "...";
};
