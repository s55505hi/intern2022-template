import {
  Component,
  createRef,
  MutableRefObject,
  RefObject,
  TdHTMLAttributes,
  useState,
} from "react";
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
  forwardRef,
  Input,
  Flex,
  Textarea,
  Stack,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import {
  CalendarIcon,
  DeleteIcon,
  CheckIcon,
  EditIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import { BsFonts, BsFilterLeft, BsClock } from "react-icons/bs";
import { IoSaveSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import reactLogo from "./assets/react.svg";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Square } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import ja from "dayjs/locale/ja";
import weekday from "dayjs/plugin/weekday";
import { useTable } from "react-table";
import { columns } from "./tableData";
import { useCounter } from "./Counter";

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
  day: string;
  startTime: string;
  endTime: string;
  description: string;
  dayjsVal: Dayjs;
};

type ScheduleState = "create" | "edit" | "read" | null;

//日ごとの要素
type DateProps = {
  id: number;
  dayjsVal: Dayjs;
  year: number;
  month: Month;
  day: Days;
  date: number;
  schedules: Schedule[];
  addSchedule: (schedule: Schedule) => void;
  deleteSchedule: (schedule: Schedule) => void;
  onClick: () => void;
};

//日ごとの内容表示
const Date = (props: DateProps) => {
  const refs = React.useRef<RefObject<HTMLDivElement>[]>([]);
  props.schedules
    ? props.schedules.map((_, index) => {
        refs.current[index] = createRef<HTMLDivElement>();
      })
    : {};

  const [refNum, setRefNum] = useState(0);
  const [state, setState] = useState<ScheduleState>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [schedule, setSchedule] = useState<Schedule>({
    dayjsVal: props.dayjsVal,
    title: "",
    day: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  let tmp: Schedule = {
    dayjsVal: props.dayjsVal,
    title: "",
    day: "",
    startTime: "",
    endTime: "",
    description: "",
  };

  tmp = schedule;

  const saveSchedule = () => {
    console.log(tmp);
    setSchedule(tmp);
    console.log(schedule);
    tmp = {
      dayjsVal: props.dayjsVal,
      title: "",
      day: "",
      startTime: "",
      endTime: "",
      description: "",
    };
    setSchedule(tmp);
    console.log(schedule);

    props.addSchedule(schedule);
  };

  const createSchedule = () => {
    setState("create");
    console.log(state);
    console.log(props.schedules);
    onOpen();
  };

  const readSchedule = () => {
    setState("read");
    onOpen();
  };

  const editSchedule = () => {
    setState("edit");
    onOpen();
  };

  const getSchedule = (e: RefObject<HTMLDivElement>) => {
    console.log(e.current);
    // if (e.current?.id) {
    // }
  };

  const deleteSchedule = (e: RefObject<HTMLDivElement>) => {
    if (e.current?.id) {
      console.log(e.current);
      props.deleteSchedule(props.schedules[+e.current?.id]);
    }
  };

  return (
    <>
      <div className="date-container">
        <Popover placement="auto-end" isOpen={isOpen} onClose={onClose}>
          {props.dayjsVal.format("DD/MM/YYYY") == now.format("DD/MM/YYYY") ? (
            <>
              <div className="today" />
              <div>{props.date}日</div>
            </>
          ) : (
            <div>{props.date}日</div>
          )}
          <PopoverTrigger>
            <>
              {props.schedules ? (
                props.schedules.map((value, index) => (
                  <div
                    className="date-schedule"
                    onClick={() => {
                      setRefNum(index);
                      readSchedule();
                    }}
                    id={`${index}`}
                    key={index}
                    ref={refs.current[index]}
                  >
                    {value.title}
                  </div>
                ))
              ) : (
                <></>
              )}
              <div className="schedule-create" onClick={createSchedule}>
                新規作成...
              </div>
            </>
          </PopoverTrigger>
          <PopoverContent>
            {state == "create" ? (
              <>
                <PopoverArrow />
                <PopoverHeader>
                  予定の作成
                  <IconButton
                    icon={<CheckIcon />}
                    aria-label={"Save"}
                    onClick={() => {
                      saveSchedule();
                      onClose();
                    }}
                    backgroundColor="white"
                    ml="145px"
                    top="-7px"
                    size="xs"
                  />
                </PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  <Stack>
                    <Input
                      placeholder="タイトルを入力"
                      onChange={(event) => (tmp.title = event.target.value)}
                    />
                    <Input
                      placeholder="年/月/日"
                      type="date"
                      onChange={(event) => (tmp.day = event.target.value)}
                    />
                    <HStack>
                      <Input
                        placeholder="--:--"
                        type="time"
                        onChange={(event) =>
                          (tmp.startTime = event.target.value)
                        }
                      />
                      <p>~</p>
                      <Input
                        placeholder="--:--"
                        type="time"
                        onChange={(event) => (tmp.endTime = event.target.value)}
                      />
                    </HStack>
                    <Textarea
                      placeholder="memo"
                      onChange={(event) =>
                        (tmp.description = event.target.value)
                      }
                    />
                  </Stack>
                </PopoverBody>
              </>
            ) : state == "read" ? (
              <>
                <PopoverArrow />
                <PopoverHeader>
                  予定の詳細
                  <IconButton
                    icon={<EditIcon />}
                    aria-label={"Edit"}
                    onClick={() => {
                      editSchedule();
                      onClose();
                    }}
                    backgroundColor="white"
                    ml="145px"
                    top="-7px"
                    size="xs"
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label={"Delete"}
                    onClick={() => {
                      deleteSchedule(refs.current[refNum]);
                      onClose();
                    }}
                    backgroundColor="white"
                    top="-7px"
                    size="xs"
                  />
                </PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  <Stack>
                    <HStack>
                      <Icon as={BsFonts} />
                      <Text>{getSchedule(refs.current[refNum])?.title}</Text>
                    </HStack>
                    <HStack>
                      <CalendarIcon />
                      <Text>aa</Text>
                    </HStack>
                    <HStack>
                      <Icon as={BsClock} />
                      <Text>aa</Text>
                    </HStack>
                    <HStack>
                      <Icon as={BsFilterLeft} />
                      <Text>aa</Text>
                    </HStack>
                  </Stack>
                </PopoverBody>
              </>
            ) : (
              <></>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

//1月ごとの要素
type MonthProps = {
  squares: DateProps[];
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
    elm.push(
      <tr key={`row_${props.squares[i].dayjsVal.format("YYYY/MM/DD")}`}>
        {items}
      </tr>
    );
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
  const [schedules, setSchedules] = useState<Schedule[]>([]);

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

const getCalendarData = (i: number) => {
  const data = now.add(i, "month");
  const startDate = data.startOf("month");
  const endDate = data.endOf("month");
  const startDay = startDate.get("day");
  const endDay = endDate.get("day");
  return { data, startDay, endDay, startDate, endDate };
};

export default Calendar;
