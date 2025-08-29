import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (date, timezone = "America/New_York") => {
  return dayjs(date).tz(timezone).format("YYYY-MM-DD");
};
