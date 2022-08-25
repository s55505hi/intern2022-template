import {
  Children,
  Component,
  createRef,
  FormEventHandler,
  MutableRefObject,
  RefObject,
  TdHTMLAttributes,
  useEffect,
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
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
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
import cloneDeep from "lodash/cloneDeep";
import { useTable } from "react-table";
import { columns } from "./tableData";
import { useCounter } from "./Counter";
import { useHolidays } from "./holidays";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import { property } from "lodash";

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
  editSchedule: (schedule: Schedule, num: number) => void;
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

  const inputRefs = useRef<RefObject<HTMLInputElement>[]>([]);

  const [refNum, setRefNum] = useState(0);
  const [state, setState] = useState<ScheduleState>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [detail, setDetail] = useState<Schedule>();
  const [schedule, setSchedule] = useState<Schedule>({
    dayjsVal: props.dayjsVal,
    title: "",
    day: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  const [input, setInput] = useState<Schedule>({
    dayjsVal: props.dayjsVal,
    title: "",
    day: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const handleChange = (newTitle: string) => {
    // setInput({ [property]: e.target.value });

    setInput((prev) => {
      return { ...prev, title: newTitle };
    });
  };

  // const handleS

  let tmp = schedule;

  const titleError = inputRefs.current[0]?.current?.value === "";
  const dayError = inputRefs.current[1]?.current?.value === "";

  const saveSchedule = (e?: RefObject<HTMLDivElement>) => {
    console.log("tmp", tmp);
    console.log("schedule", schedule);

    // setSchedule(tmp);
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
    if (state == "create") {
      props.addSchedule(schedule);
      console.log("add", props.schedules);
    } else if (state == "edit" && e && e.current) {
      console.log(+e.current.id);
      setDetail(schedule);
      props.editSchedule(schedule, +e.current?.id);
      console.log("edit", props.schedules);
    }
  };

  const createSchedule = () => {
    setState("create");
    console.log(state);
    onOpen();
  };

  const readSchedule = () => {
    setState("read");
    onOpen();
  };

  const editSchedule = () => {
    setState("edit");
    detail ? (tmp = detail) : {};
    setSchedule(tmp);
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
      console.log("delete", props.schedules);
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
                      setDetail(props.schedules[index]);
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
                      console.log(titleError, dayError);
                      console.log(
                        inputRefs.current[0]?.current?.value,
                        inputRefs.current[1]?.current?.value
                      );
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
                  <form name="createForm">
                    <Stack>
                      <FormControl isInvalid={titleError}>
                        <Input
                          name={"title"}
                          isRequired
                          placeholder="タイトルを入力"
                          maxLength={10}
                          value={input?.title}
                          ref={inputRefs.current[0]}
                          onChange={(event) => {
                            tmp.title = event.target.value;
                            handleChange(event.target.value);
                          }}
                        />
                        {titleError ? (
                          <FormErrorMessage>title isRequired</FormErrorMessage>
                        ) : (
                          <></>
                        )}
                      </FormControl>
                      <FormControl>
                        <Input
                          isRequired
                          // placeholder="年/月/日"
                          type="date"
                          pattern="^[0-9]{4}/[0-9]{2}/[0-9]{2}"
                          ref={inputRefs.current[1]}
                          onChange={(event) => (tmp.day = event.target.value)}
                        />
                        {dayError ? (
                          <FormErrorMessage>day is isRequired</FormErrorMessage>
                        ) : (
                          <></>
                        )}
                      </FormControl>

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
                          onChange={(event) =>
                            (tmp.endTime = event.target.value)
                          }
                        />
                      </HStack>
                      <Textarea
                        placeholder="memo"
                        maxLength={255}
                        onChange={(event) =>
                          (tmp.description = event.target.value)
                        }
                      />
                    </Stack>
                  </form>
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
                      <Text>{detail?.title}</Text>
                    </HStack>
                    <HStack>
                      <CalendarIcon />
                      <Text>{detail?.day}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={BsClock} />
                      <Text>{detail?.startTime}</Text>
                      <Text>~</Text>
                      <Text>{detail?.endTime}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={BsFilterLeft} />
                      <Text>{detail?.description}</Text>
                    </HStack>
                  </Stack>
                </PopoverBody>
              </>
            ) : (
              <>
                <PopoverArrow />
                <PopoverHeader>
                  予定の編集
                  <IconButton
                    icon={<CheckIcon />}
                    aria-label={"Save"}
                    onClick={() => {
                      saveSchedule(refs.current[refNum]);
                      setState("read");
                      onOpen();
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
                    <FormControl>
                      <Input
                        isRequired
                        defaultValue={detail?.title}
                        maxLength={10}
                        onChange={(event) => (tmp.title = event.target.value)}
                      ></Input>
                    </FormControl>
                    <FormControl>
                      <Input
                        isRequired
                        defaultValue={detail?.day}
                        type="date"
                        onChange={(event) => (tmp.day = event.target.value)}
                      ></Input>
                    </FormControl>
                    <HStack>
                      <Input
                        defaultValue={detail?.startTime}
                        type="time"
                        onChange={(event) =>
                          (tmp.startTime = event.target.value)
                        }
                      />
                      <p>~</p>
                      <Input
                        defaultValue={detail?.endTime}
                        type="time"
                        onChange={(event) => (tmp.endTime = event.target.value)}
                      />
                    </HStack>
                    <Textarea
                      maxLength={255}
                      defaultValue={detail?.description}
                      onChange={(event) =>
                        (tmp.description = event.target.value)
                      }
                    />
                  </Stack>
                </PopoverBody>
              </>
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
