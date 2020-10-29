import React, { useState, createContext, useContext, useCallback } from "react";

const initialState = {
  primary: 0,
  secondary: 0,
  poolPower: 0,
  epicPool: 0,
  activeLevel: 0,
  powerSlot: null,
};

const context = createContext();

export const IndexTrackingProvider = (props) => {
  const [tracking, setTracking] = useState(initialState);

  const { Provider } = context;

  const setIndex = useCallback(
    (key, index) => setTracking({ ...tracking, [key]: index }),
    [tracking]
  );

  const state = { tracking, setIndex };

  return <Provider value={state}>{props.children}</Provider>;
};

export default () => useContext(context);
