import { useState, useEffect } from "react";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  Axios,
} from "axios";

const url = "https://holidays-jp.github.io/api/v1/datetime.json";

const options: AxiosRequestConfig = {
  url: url,
  method: "GET",
};

export const useHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [status, setStaus] = useState<number | null>(null);

  useEffect(() => {
    axios(options)
      .then((response: AxiosResponse) => {
        const { data, status } = response;
        setHolidays(data);
        setStaus(status);
      })
      .catch((e: AxiosError<{ error: string }>) => {
        console.log(e.message);
      });
    // console.log(holidays.values());
  });
  return holidays;
};
