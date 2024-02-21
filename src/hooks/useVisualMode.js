// import { func } from "prop-types";
import { useState } from "react";

export function useVisualMode(initial) {
  // const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  //UpdateMode handler
  function transition(newMode, replace = false) {
    setHistory((prev) => {
      if (replace) {
        return [...prev.slice(0, prev.length - 1), newMode]
      } else {
        return [...prev, newMode]
      }
    });
  };

  //func to go back to the prev state
  //to transition back to the previous mode, we need to remove the last item from the stack, 
  //and then setMode with the last item in the array.

  //slice method with parameters (0, prev.length - 1) returns 
  //a new array containing elements from index 0 to prev.length - 1, effectively removing the last element.

  const back = () => {
    setHistory((prev) =>
      prev.length === 1 ? prev : [...prev.slice(0, prev.length - 1)]
    );
  };
  return { mode: history[history.length - 1], transition, back };
};

//As seen here, the `useVisualMode` function can take an initial argument to set the mode state. 
//We then return an object `{ mode }`, which can also be written as `{ mode: mode }`. 
//This lets our tests (and components) access the current value of the mode from the hook.
