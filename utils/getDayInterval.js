import dayjs from "dayjs";

export const getDayInterval = (date) => ({
  startDate: dayjs(date).startOf("day"),
  endDate: dayjs(date).endOf("day"),
});
