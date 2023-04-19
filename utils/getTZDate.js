import dayjs from "dayjs";
import { TimeZone } from "@/constants";

/**
 * @param {dayjs} date - dayjs date object
 * @description - returns date object with timezone
 */
export const getTZDate = (date = dayjs()) => dayjs.tz(date, TimeZone);
