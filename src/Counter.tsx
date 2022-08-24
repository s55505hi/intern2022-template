import { useState } from "react";

export const useCounter = (init = 0) => {
  const [count, setCount] = useState(init);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);

  return { count, increment, decrement };
};
