import React, { useState, createContext, useContext } from "react";

import useCharacters from "../useCharacters.js";

import type { PowerSlot, ActiveSets, Power } from "flow/types.js";

const context = createContext();

export const IndexTrackingProvider = (props) => {
  const { activeCharacter } = useCharacters();
  const { powerSlots } = activeCharacter || {};

  const [tracking, setTracking] = useState(getInitialState());

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

function getInitialState(powerSlots: Array<PowerSlot>): ActiveSets {
  const initialState = {
    primary: 0,
    secondary: 0,
    poolPower: 0,
    epicPool: 0,
    activeLevel: 1,
    toggledSlot: null,
    toggledSet: null,
  };

  const primaryPower = searchForPower(powerSlots, "primary");
  const secondaryPower = searchForPower(powerSlots, "secondary");
  const epicPower = searchForPower(powerSlots, "epicPool");

  if (primaryPower) {
    initialState.primary = primaryPower.power.powersetIndex;
  }

  if (secondaryPower) {
    initialState.secondary = secondaryPower.power.powersetIndex;
  }

  if (epicPower) {
    initialState.epicPool = epicPower.power.powersetIndex;
  }

  return initialState;
}

function searchForPower(
  powerSlots: Array<PowerSlot>,
  archetypeOrder: string
): Power | void {
  if (!powerSlots) {
    return;
  }

  return powerSlots.find(
    ({ power }) =>
      power &&
      power.powersetIndex !== undefined &&
      power.archetypeOrder === archetypeOrder
  );
}
