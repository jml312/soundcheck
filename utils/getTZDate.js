import dayjs from "dayjs";
import { TimeZone } from "@/constants";
import utc from "dayjs/plugin/utc";
import timeZone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timeZone);

/**
 * @param {dayjs} date - dayjs date object
 * @description - returns date object with timezone
 */
export const getTZDate = (date = dayjs()) => dayjs.tz(date, TimeZone);
