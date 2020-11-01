import React, { useState, createContext, useContext } from "react";

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

  const setActiveTracking = (e) => {
    const { name, value } = e.target;
    setTracking({ ...tracking, [name]: value });
  };

  const setTrackingManually = (name, value) =>
    setTracking({ ...tracking, [name]: value });

  const togglePowerSlot = (psIndex) =>
    setTracking({
      ...tracking,
      powerSlot: tracking.powerSlot === psIndex ? null : psIndex,
    });

  const { Provider } = context;
  const state = {
    tracking,
    setActiveTracking,
    setTrackingManually,
    togglePowerSlot,
  };
  return <Provider value={state}>{props.children}</Provider>;
};

export default () => useContext(context);
