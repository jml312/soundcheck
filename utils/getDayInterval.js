/**
 * @param {dayjs} dayjsDate - dayjs date object
 * @returns {object} start and end of dayjs date object
 */
export const getDayInterval = (dayjsDate) => ({
  startDate: dayjsDate.startOf("day"),
  endDate: dayjsDate.endOf("day"),
});
