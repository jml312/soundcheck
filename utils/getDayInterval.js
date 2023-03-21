export const getDayInterval = (dayjsDate) => ({
  startDate: dayjsDate.startOf("day"),
  endDate: dayjsDate.endOf("day"),
});
