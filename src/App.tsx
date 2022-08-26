import { useEffect, useState } from "react";
import "./index.css";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";
import weekday from "dayjs/plugin/weekday";

import type { Schedule, DateProps } from "./props";
import CalendarBoard from "./CalendarBoard";
import { getCalendarData } from "./dayjsData";

//dayjs初期化
dayjs.extend(weekday);
dayjs.locale(ja);
const now = dayjs();
console.log(now.day());

//曜日文字列配列
const week = ["日", "月", "火", "水", "木", "金", "土"];
// const week = Object.keys(Days).filter((v) => isNaN(Number(v)));
// console.log(week[week.length - 1]);

const Calendar = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  useEffect(() => {
    console.log("schedules", schedules);
  }, [schedules]);

  //月選択用(現在日時からの相対)
  const [current, setCurrent] = useState(0);

  let calendarTable: DateProps[] = [];

  const generate = (i: number) => {
    calendarTable = [];
    // console.log(current);
    const nowData = getCalendarData(i);
    const lastMonthData = getCalendarData(i - 1);
    const nextMonthData = getCalendarData(i + 1);
    const lastDate = nowData.startDate.add(-1, "day").get("date");

    // console.log(nowData);
    let cnt = 0;

    for (let date = nowData.startDay; date > 0; date--) {
      const dayjsVal = nowData.startDate.subtract(date, "day");
      const thisMonth: DateProps = {
        id: cnt,
        dayjsVal,
        year: lastMonthData.data.get("year"),
        month: lastMonthData.data.get("month"),
        day: nowData.startDate.subtract(date, "day").day(),
        date: lastDate - date + 1,
        schedules: schedules.filter((schedule) => {
          return schedule.dayjsVal.isSame(dayjsVal);
        }),
        addSchedule: (schedule) => {
          setSchedules([...schedules, schedule]);
        },
        deleteSchedule: (schedule) => {
          setSchedules(schedules.filter((val) => val != schedule));
        },
        editSchedule: (schedule, num) => {
          setSchedules(
            schedules.map((value, index) => (index === num ? schedule : value))
          );
        },
        onClick: () => handleClick(thisMonth),
      };
      calendarTable.push(thisMonth);
      cnt++;
    }

    for (
      let date = nowData.startDate.get("date");
      date < nowData.endDate.get("date") + 1;
      date++
    ) {
      // console.log(date);
      const dayjsVal = nowData.startDate.add(date - 1, "day");
      const thisMonth = {
        id: cnt,
        dayjsVal: nowData.startDate.add(date - 1, "day"),
        year: nowData.data.get("year"),
        month: nowData.data.get("month"),
        day: nowData.startDate.add(date - 1, "day").day(),
        date: date,
        schedules: schedules.filter((schedule) => {
          return schedule.dayjsVal.isSame(dayjsVal);
        }),
        addSchedule: (schedule: Schedule) => {
          setSchedules([...schedules, schedule]);
        },
        deleteSchedule: (schedule: Schedule) => {
          setSchedules(schedules.filter((val) => val != schedule));
        },
        editSchedule: (schedule: Schedule, num: number) => {
          setSchedules(
            schedules.map((value, index) => (index === num ? schedule : value))
          );
        },
        onClick: () => handleClick(thisMonth),
      };
      cnt++;
      calendarTable.push(thisMonth);
    }
    // console.log(nowData.endDay);

    for (let day = 1; day < 7 - nowData.endDay; day++) {
      // console.log(day);
      const dayjsVal = nowData.endDate.add(day, "day");
      const thisMonth: DateProps = {
        id: cnt,
        dayjsVal,
        year: nextMonthData.data.get("year"),
        month: nextMonthData.data.get("month"),
        day: nowData.endDay + day,
        date: nowData.endDate.add(day, "day").get("date"),
        schedules: schedules.filter((schedule) => {
          return schedule.dayjsVal.isSame(dayjsVal);
        }),
        addSchedule: (schedule) => {
          setSchedules([...schedules, schedule]);
        },
        deleteSchedule: (schedule) => {
          setSchedules(schedules.filter((val) => val != schedule));
        },
        editSchedule: (schedule, num) => {
          setSchedules(
            schedules.map((value, index) => (index === num ? schedule : value))
          );
        },
        onClick: () => handleClick(thisMonth),
      };

      cnt++;
      calendarTable.push(thisMonth);
    }
    // console.log(calendarTable);
    return { calendarTable, nowData };
  };

  const selectMonth = (i: number) => {
    setCurrent((current) => current + i);
    console.log(current);
    // generate(current);
    return;
  };

  const handleClick = (data: DateProps) => {
    console.log(data.id);
    console.log(calendarTable[data.id]);
    return;
  };

  return (
    <div>
      <div className="monthSelect">
        <span>
          {/* <Icon /> */}
          <span id="calendar">calendar</span>
          <button className="selectButton" onClick={() => selectMonth(-1)}>
            {"<"}
          </button>
          {`${generate(current).nowData.data.format("YYYY")}年
          ${generate(current).nowData.data.format("M")}月`}
          <button className="selectButton" onClick={() => selectMonth(1)}>
            {">"}
          </button>
        </span>
      </div>
      <table>
        <tbody>
          <tr className="dayHeader">
            {week.map((day, index) => {
              return <th key={index}>{day}曜日</th>;
            })}
          </tr>

          <CalendarBoard
            squares={generate(current).calendarTable}
            onClick={handleClick}
          />
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
