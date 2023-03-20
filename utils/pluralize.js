export const pluralize = (singular, value) =>
  `${value} ${singular}${value === 1 ? "" : "s"}`;
