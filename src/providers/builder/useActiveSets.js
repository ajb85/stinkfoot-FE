import React, { useState, createContext, useContext } from "react";

import useCharacters from "../useCharacters.js";

const initialState = {
  primary: 0,
  secondary: 0,
  poolPower: 0,
  epicPool: 0,
  activeLevel: 1,
  toggledSlot: null,
  toggledSet: null,
};

const context = createContext();

export const IndexTrackingProvider = (props) => {
  const { activeCharacter } = useCharacters();
  const { powerSlots } = activeCharacter || {};
  const primaryPower =
    powerSlots &&
    powerSlots.find(
      ({ power }) =>
        power &&
        power.powersetIndex !== undefined &&
        power.archetypeOrder === "primary"
    );
  const secondaryPower =
    powerSlots &&
    powerSlots.find(
      ({ power }) =>
        power &&
        power.powersetIndex !== undefined &&
        power.archetypeOrder === "secondary"
    );

  if (primaryPower) {
    initialState.primary = primaryPower.power.powersetIndex;
  }

  if (secondaryPower) {
    initialState.secondary = secondaryPower.power.powersetIndex;
  }

  const [tracking, setTracking] = useState(initialState);

  const setActiveTracking = (e) => {
    const { name, value } = e.target;
    setTracking({ ...tracking, [name]: value });
  };

  const setTrackingManually = (name, value) => {
    setTracking({ ...tracking, [name]: value });
  };

  const clearToggles = () => {
    setTracking({ ...tracking, toggledSlot: null, toggledSet: null });
  };

  const { Provider } = context;
  const state = {
    tracking,
    setActiveTracking,
    setTrackingManually,
    clearToggles,
  };
  return <Provider value={state}>{props.children}</Provider>;
};

export default () => useContext(context);
