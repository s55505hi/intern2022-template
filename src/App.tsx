import { Component, useState } from "react";
import {
  Center,
  HStack,
  Box,
  Button,
  Heading,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import reactLogo from "./assets/react.svg";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Repeat } from "typescript-tuple";
import { Square } from "@chakra-ui/react";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";
import { useTable } from "react-table";
import { columns } from "./tableData";

//dayjs初期化
dayjs.locale(ja);
const now = dayjs();

//曜日列挙
enum Days {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}

//曜日文字列配列
const week = ["日", "月", "火", "水", "木", "金", "土"];
// const week = Object.keys(Days).filter((v) => isNaN(Number(v)));
// console.log(week[week.length - 1]);

//月列挙
enum Month {
  Jan,
  Feb,
  Mar,
  Apr,
  May,
  Jun,
  Jul,
  Aug,
  Sept,
  Oct,
  Nov,
  Dec,
}

//予定
type Schedule = {
  title: string;
  day: string;
  startTime: string;
  endTime: string;
  description: string;
};

//日ごとの要素
type DateProps = {
  id: number;
  year: number | dayjs.Dayjs;
  month: Month | dayjs.Dayjs;
  day: Days | dayjs.Dayjs;
  dayNumber: number | dayjs.Dayjs;
  schedule?: Schedule[];
  onClick: () => void;
};

//日ごとの内容表示
const Date = (props: DateProps) => (
  <div className="date-container">
    <div onClick={props.onClick}>{props.dayNumber as number}</div>
    {props.schedule ? (
      <div className="date-schedule">${props.schedule[0].title}</div>
    ) : (
      ""
    )}
  </div>
);

//1月ごとの要素
type MonthState = Repeat<DateProps, 35>;

type MonthProps = {
  squares: MonthState;
  onClick: (data: DateProps) => void;
};

const CalendarBoard = (props: MonthProps) => {
  const renderDate = (i: number) => (
    <Date
      {...props.squares[i]}
      onClick={() => props.onClick(props.squares[i])}
    />
  );

  const elm = [];
  for (let i = 0; i < props.squares.length; i += 7) {
    const items = [];
    for (let j = Days.Sun; j < Days.Sat + 1; j++) {
      items.push(<td key={i + j}>{renderDate(i + j)}</td>);
    }
    elm.push(<tr key={`row_${i / 7 + 1}`}>{items}</tr>);
  }
  // console.log(elm);
  return (
    <>
      {elm.map((value) => {
        return value;
      })}
    </>
  );
};

type Data = {
  squares: MonthState;
};

type CalendarState = {
  readonly days: Data[];
  readonly index: number;
};

const Calendar = () => {
  // let current = 0;
  const [current, setCurrent] = useState(0);
  const [schedule, setSchedule] = useState<Schedule>();

  const generate = (i: number) => {
    // console.log(current);
    const nowData = getCalendarData(i);
    const lastMonthData = getCalendarData(i - 1);
    const nextMonthData = getCalendarData(i + 1);
    const lastDate = nowData.startDate.add(-1, "day").get("date");

    const calendarTable: DateProps[] = [];
    // console.log(nowData.data.format("M"));
    let cnt = 0;

    for (let day = nowData.startDay; day > 0; day--) {
      const thisMonth = {
        id: cnt,
        year: lastMonthData.data.get("year"),
        month: lastMonthData.data.get("month"),
        day: day,
        dayNumber: lastDate - day + 1,
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
      const thisMonth = {
        id: cnt,

        year: nowData.data.get("year"),
        month: nowData.data.get("month"),
        day: nowData.startDate.add(date).get("day"),
        dayNumber: date,
        onClick: () => handleClick(thisMonth),
      };
      cnt++;
      calendarTable.push(thisMonth);
    }
    // console.log(nowData.endDay);

    for (let day = 1; day < 7 - nowData.endDay; day++) {
      // console.log(day);
      const thisMonth: DateProps = {
        id: cnt,
        year: nextMonthData.data.get("year"),
        month: nextMonthData.data.get("month"),
        day: day,
        dayNumber: nowData.endDate.add(day, "day").get("date"),
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
    return;
  };

  return (
    <div>
      <div className="monthSelect">
        <span>
          <button className="prev" onClick={() => selectMonth(-1)}>
            {"<"}
          </button>
          {`${generate(current).nowData.data.format("YYYY")}年
          ${generate(current).nowData.data.format("M")}月`}
          <button className="next" onClick={() => selectMonth(1)}>
            {">"}
          </button>
        </span>
      </div>
      <table>
        <tbody>
          <tr className="dayHeader">
            {week.map((day, index) => {
              return <th key={index}>{day}</th>;
            })}
          </tr>

          {/* <tr>
            {state.days.map((days, index) => {
              return <td key={index}>{days.dayNumber}</td>;
            })}
          </tr> */}
          <CalendarBoard
            squares={generate(current).calendarTable}
            onClick={handleClick}
          />
        </tbody>
      </table>
    </div>
  );
};

const getCalendarData = (i: number) => {
  const data = now.add(i, "month");
  const startDate = data.startOf("month");
  const endDate = data.endOf("month");
  const startDay = startDate.get("day");
  const endDay = endDate.get("day");
  return { data, startDay, endDay, startDate, endDate };
};

export default Calendar;
