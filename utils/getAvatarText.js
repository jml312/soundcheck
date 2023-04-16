/**
 * @param {string} name
 * @returns {string} avatar text
 */
export const getAvatarText = (name) => {
  return (
    name &&
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
  );
};
