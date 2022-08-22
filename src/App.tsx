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
  useDisclosure,
  Popover,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  PopoverFooter,
  PopoverBody,
  PopoverTrigger,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import reactLogo from "./assets/react.svg";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Repeat } from "typescript-tuple";
import { Square } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import ja from "dayjs/locale/ja";
import weekday from "dayjs/plugin/weekday";
import { useTable } from "react-table";
import { columns } from "./tableData";

//dayjs初期化
dayjs.extend(weekday);
dayjs.locale(ja);
const now = dayjs();
console.log(now.day());

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
  day: string | dayjs.Dayjs;
  startTime: string;
  endTime: string;
  description: string;
};

const SchedulePopOver = () => {
  const { isOpen, onClose } = useDisclosure();
  const firstFieldRef = React.useRef(null);
  return (
    <Popover isOpen={isOpen} onClose={onClose}>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>header</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Button colorScheme="blue" onClick={onClose}>
              close
            </Button>
          </PopoverBody>
          <PopoverFooter>footer</PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

//日ごとの要素
type DateProps = {
  id: number;
  dayjsVal: Dayjs;
  year: number;
  month: Month;
  day: Days;
  date: number;
  schedule?: Schedule[];
  onClick: () => void;
};

//日ごとの内容表示
const Date = (props: DateProps) => (
  <div className="date-container" onClick={props.onClick}>
    {props.dayjsVal.format("DD/MM/YYYY") == now.format("DD/MM/YYYY") ? (
      <div className="today">{props.date}日</div>
    ) : (
      <div>{props.date}日</div>
    )}
    {props.schedule ? (
      <div className="date-schedule">{props.schedule[0].title}</div>
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

//日ごとの表示
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

const Calendar = () => {
  const [state, setState] = useState<DateProps[]>([]);

  //月選択用(現在日時からの相対)
  const [current, setCurrent] = useState(0);

  //スケジュール動的変更
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const newSchedule = () => {
    setSchedule([
      ...schedule,
      {
        title: "",
        day: "",
        startTime: "",
        endTime: "",
        description: "",
      },
    ]);
  };

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
      const thisMonth = {
        id: cnt,
        dayjsVal: nowData.startDate.subtract(date, "day"),
        year: lastMonthData.data.get("year"),
        month: lastMonthData.data.get("month"),
        day: nowData.startDate.subtract(date, "day").day(),
        date: lastDate - date + 1,
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
        dayjsVal: nowData.startDate.add(date - 1, "day"),
        year: nowData.data.get("year"),
        month: nowData.data.get("month"),
        day: nowData.startDate.add(date - 1, "day").day(),
        date: date,
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
        dayjsVal: nowData.endDate.add(day, "day"),
        year: nextMonthData.data.get("year"),
        month: nextMonthData.data.get("month"),
        day: nowData.endDay + day,
        date: nowData.endDate.add(day, "day").get("date"),
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
    calendarTable[data.id].schedule?.push(newSchedule);
    console.log(data.id);
    console.log(calendarTable[data.id]);
    return;
  };

  return (
    <div>
      <div className="monthSelect">
        <span>
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

          {/* <tr>
            {state.days.map((days, index) => {
              return <td key={index}>{days.date}</td>;
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
