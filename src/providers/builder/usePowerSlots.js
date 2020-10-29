import React, { useState, createContext, useContext } from "react";

import powerSlotsTemplate from "data/powerSlotsTemplate.js";

const context = createContext();

export const PowerSlotsProvider = (props) => {
  const [powerSlots, setPowerSlots] = useState(powerSlotsTemplate);

  const { Provider } = context;

  const state = { powerSlots, setPowerSlots };
  return <Provider value={state}>{props.children}</Provider>;
};

export default () => useContext(context);
