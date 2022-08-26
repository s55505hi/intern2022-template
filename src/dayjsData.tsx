import dayjs from "dayjs";
import ja from "dayjs/locale/ja";
import weekday from "dayjs/plugin/weekday";

//dayjs初期化
dayjs.extend(weekday);
dayjs.locale(ja);
export const now = dayjs();

export const getCalendarData = (i: number) => {
  const data = now.add(i, "month");
  const startDate = data.startOf("month");
  const endDate = data.endOf("month");
  const startDay = startDate.get("day");
  const endDay = endDate.get("day");
  return { data, startDay, endDay, startDate, endDate };
};
