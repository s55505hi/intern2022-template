import type { MonthProps } from "./props";
import Date from "./Date";
import { Days } from "./enums";
import { Popover, PopoverTrigger } from "@chakra-ui/react";

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

export default CalendarBoard;
