export const getAvatarText = (name) =>
  name &&
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);
