import dayjs from "dayjs";
import { TimeZone } from "@/constants";

/**
 * @param {dayjs} dayjsDate - dayjs date object
 * @returns {object} start and end of dayjs date object
 */
export const getDayInterval = (dayjsDate) => {
  return {
    startDate: dayjs.tz(dayjsDate, TimeZone).startOf("day"),
    endDate: dayjs.tz(dayjsDate, TimeZone).endOf("day"),
  };
};
