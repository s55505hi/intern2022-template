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

dayjs.locale(ja);

const data = null;

//dayjs初期化
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
const week = Object.keys(Days).filter((v) => isNaN(Number(v)));
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
    <div>{props.dayNumber.valueOf()}</div>
    {props.schedule ? (
      <div className="date-schedule">${props.schedule[0].title}</div>
    ) : (
      ""
    )}
  </div>
);

//1月ごとの要素
type MonthState = Repeat<DateProps, 42>;

type MonthProps = {
  squares: MonthState;
  onClick: (i: number) => void;
};

const CalendarBoard = (props: MonthProps) => {
  const renderDate = (i: number) => (
    <Date {...props.squares[i]} onClick={() => props.onClick(i)} />
  );
  const elm = (
    <tr>
      {(() => {
        const items = [];
        items.push(<tr></tr>);
        for (let i = 0; i < props.squares.length; i++) {
          for (let j = Days.Sun; j < Days.Sat + 1; j++) {
            items.push(<td>{renderDate(j)}</td>);
          }
        }
        console.log(items);
        return items;
      })()}
    </tr>
  );

  return elm;
};

type Data = {
  squares: MonthState;
};

type CalendarState = {
  readonly days: Data[];
  readonly index: number;
};

const Calendar = () => {
  const nowData = getCalendarData(0);
  const calendarTable: DateProps[] = [];
  // const thisMonth = (props: MonthProps) => {
  //   squares: [null];
  // };

  for (let i = 0; i < 42; i++) {
    const thisMonth = {
      year: nowData[0],
      month: nowData[0],
      day: nowData[1],
      dayNumber: i + 1,
      onClick: () => handleClick(i),
    };
    calendarTable.push(thisMonth);
  }

  // const current = state.days[state.index];

  // const next: Date = (({ year, month, day, dayNumber }) => {
  //   return {
  //     dayNumber: dayNumber + 1,
  //     month:
  //       dayNumber > 31
  //         ? month + 1 > Month.Dec
  //           ? Month.Jan
  //           : month + 1
  //         : month,
  //     year: year,
  //     day: day + 1 > Days.Sat ? Days.Sun : day + 1,
  //     schedule: [],
  //   };
  // })(current);

  // setState(({ days, index }) => {
  //   const newDate = days.slice(0, index + 1).concat(next);

  //   return {
  //     days: newDate,
  //     index: newDate.length - 1,
  //   };
  // });
  const handleClick = (i: number) => {
    return;
  };

  return (
    <div>
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
          <CalendarBoard squares={calendarTable} onClick={handleClick} />
        </tbody>
      </table>
    </div>
  );
};

const getCalendarData = (i: number) => {
  const month = now.add(i, "month");
  const startDate = month.startOf("month");
  const endDate = month.endOf("month");
  const startDay = startDate.get("day");
  const endDay = endDate.get("day");
  return [month, startDay, endDay, startDate, endDate];
};

export default Calendar;
