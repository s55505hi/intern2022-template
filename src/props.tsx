import type { Dayjs } from "dayjs";
import type { Days, Month } from "./enums";

//予定
export type Schedule = {
  title: string;
  day: string;
  startTime: string;
  endTime: string;
  description: string;
  dayjsVal: Dayjs;
};

//日ごとの要素
export type DateProps = {
  id: number;
  dayjsVal: Dayjs;
  year: number;
  month: Month;
  day: Days;
  date: number;
  schedules: Schedule[];
  addSchedule: (schedule: Schedule) => void;
  deleteSchedule: (schedule: Schedule) => void;
  editSchedule: (schedule: Schedule, num: number) => void;
  onClick: () => void;
};

//1月ごとの要素
export type MonthProps = {
  squares: DateProps[];
  onClick: (data: DateProps) => void;
};

export type Data = {
  data: Dayjs;
  startDay: number;
  endDay: number;
  startDate: Dayjs;
  endDate: Dayjs;
};
