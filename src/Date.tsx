import {
  CheckIcon,
  EditIcon,
  DeleteIcon,
  CalendarIcon,
} from "@chakra-ui/icons";
import {
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  IconButton,
  PopoverCloseButton,
  PopoverBody,
  Stack,
  FormControl,
  Input,
  FormErrorMessage,
  HStack,
  Textarea,
  Text,
  Portal,
  Icon,
} from "@chakra-ui/react";
import { RefObject, useEffect } from "react";
import React, { createRef, useRef } from "react";
import { useState } from "react";
import { BsFonts, BsClock, BsFilterLeft } from "react-icons/bs";
import dayjs from "dayjs";

import useHolidays from "./holidays";
import type { DateProps, Schedule } from "./props";
import { now } from "./dayjsData";

type ScheduleState = "create" | "edit" | "read" | null;

//日ごとの内容表示
const Date = (props: DateProps) => {
  const refs = React.useRef<RefObject<HTMLDivElement>[]>([]);
  props.schedules
    ? props.schedules.map((_, index) => {
        refs.current[index] = createRef<HTMLDivElement>();
      })
    : {};

  const inputRefs = useRef<RefObject<HTMLInputElement>[]>([]);
  const containerRef = useRef();

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
  //   const handleChange = (newTitle: string) => {
  const handleChange = (proparty: string, newer: string) => {
    // setInput({ [property]: e.target.value });
    setInput((prev) => {
      return { ...prev, [proparty]: newer };
    });
  };

  let tmp = schedule;

  const titleError = input.title === "";
  const date = dayjs(input.day);
  const dayError = isNaN(date.unix());

  const holidays = useHolidays();
  const thisUnix = props.dayjsVal.unix().toString();

  const [isHoliday, setHoliday] = useState(false);

  useEffect(() => {
    setSchedule(input);
    console.log("effect", schedule);
  }, [input]);
  const saveSchedule = (e?: RefObject<HTMLDivElement>) => {
    console.log("tmp", tmp);
    console.log("input", input);
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
    // setSchedule(input);
    console.log(schedule);
    if (state == "create") {
      props.addSchedule(schedule);
    } else if (state == "edit" && e && e.current) {
      setSchedule(tmp);
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
        <Popover
          placement="auto-end"
          isOpen={isOpen}
          onClose={onClose}
          z-index={999}
        >
          {props.dayjsVal.format("DD/MM/YYYY") == now.format("DD/MM/YYYY") ? (
            <>
              <div className="today" />
              <div>{props.date}日</div>
            </>
          ) : (
            <div>{props.date}日</div>
          )}
          <div className="schedule-container" ref={containerRef}>
            {/* {console.log(containerRef)} */}
            <PopoverTrigger>
              <>
                {Object.entries(holidays).map(([key, value]) => {
                  if (key === thisUnix)
                    return (
                      <div
                        className="holiday"
                        key={key}
                        onClick={() => {
                          setRefNum(+key);
                          setHoliday(true);
                          setDetail({
                            ...props,
                            title: value,
                            day: props?.dayjsVal.format("YYYY-MM-DD"),
                            startTime: "終日",
                          });
                          readSchedule();
                        }}
                      >
                        {value}
                      </div>
                    );
                })}
                {props.schedules ? (
                  props.schedules.map((value, index) => (
                    <div
                      className="date-schedule"
                      onClick={() => {
                        setRefNum(index);
                        setHoliday(false);
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
          </div>
          <Portal containerRef={containerRef}>
            <PopoverContent h="full">
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
                        console.log(input.title, input.day);
                        if (!dayError && !titleError) {
                          saveSchedule();
                          setInput((prev) => {
                            return {
                              ...prev,
                              title: "",
                              day: "",
                              startTime: "",
                              endTime: "",
                              description: "",
                            };
                          });
                          onClose();
                        }
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
                              handleChange("title", event.target.value);
                            }}
                          />
                          {titleError ? (
                            <FormErrorMessage>
                              title is required
                            </FormErrorMessage>
                          ) : (
                            <></>
                          )}
                        </FormControl>
                        <FormControl isInvalid={dayError}>
                          <Input
                            isRequired
                            // placeholder="年/月/日"
                            type="date"
                            pattern="^[0-9]{4}/[0-9]{2}/[0-9]{2}"
                            ref={inputRefs.current[1]}
                            value={input?.day}
                            onChange={(event) =>
                              handleChange("day", event.target.value)
                            }
                          />
                          {dayError ? (
                            <FormErrorMessage>day is required</FormErrorMessage>
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
                    {!isHoliday ? (
                      <>
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
                      </>
                    ) : (
                      <></>
                    )}
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
                        {!isHoliday ? (
                          <>
                            <Text>~</Text>
                            <Text>{detail?.endTime}</Text>
                          </>
                        ) : (
                          <></>
                        )}
                      </HStack>
                      {!isHoliday ? (
                        <HStack>
                          <Icon as={BsFilterLeft} />
                          <Text maxWidth={270}>{detail?.description}</Text>
                        </HStack>
                      ) : (
                        <></>
                      )}
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
                      <FormControl isInvalid={titleError}>
                        <Input
                          isRequired
                          //   defaultValue={detail?.title}
                          maxLength={10}
                          defaultValue={detail?.title}
                          onChange={(event) =>
                            handleChange("title", event.target.value)
                          }
                        ></Input>
                        {titleError ? (
                          <FormErrorMessage>title is required</FormErrorMessage>
                        ) : (
                          <></>
                        )}
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
                          onChange={(event) =>
                            (tmp.endTime = event.target.value)
                          }
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
          </Portal>
        </Popover>
      </div>
    </>
  );
};

export default Date;
