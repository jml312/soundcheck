/**
 * @param {Object} stats - Array of objects with stats
 * @param {Array} keys - Array of keys to format
 * @param {Boolean} truncateText - Whether to truncate text
 * @returns {Array} formatted stats sorted by value
 */
export const formatStats = ({ stats, keys, truncateText = true }) => {
  const maxWordLength = 20;
  return stats
    .reduce(
      (acc, stat) => {
        keys.forEach((key, idx) => {
          const curr = stat[key];
          if (Array.isArray(curr)) {
            curr.forEach((item) => {
              const itemIndex = acc[idx].findIndex(
                (item2) => item2.text === item
              );
              if (itemIndex === -1) {
                acc[idx].push({
                  text: truncateText
                    ? item.length > maxWordLength
                      ? `${item.substring(0, maxWordLength - 3)}...`
                      : item
                    : item,
                  value: 1,
                });
              } else {
                acc[idx][itemIndex].value++;
              }
            });
          } else {
            const itemIndex = acc[idx].findIndex(
              (item2) => item2.text === curr
            );
            if (itemIndex === -1) {
              acc[idx].push({ text: curr, value: 1 });
            } else {
              acc[idx][itemIndex].value++;
            }
          }
        });
        return acc;
      },
      [[], [], []]
    )
    .map((item) => item.sort((a, b) => b.value - a.value));
};
