import { getTZDate } from "./getTZDate";
import dayjs from "dayjs";

/**
 * @param {dayjs} dayjsDate - dayjs date object
 * @returns {object} start and end of dayjs date object
 */
export const getDayInterval = (dayjsDate = dayjs()) => {
  return {
    startDate: getTZDate(dayjsDate).startOf("day"),
    endDate: getTZDate(dayjsDate).endOf("day"),
  };
};
