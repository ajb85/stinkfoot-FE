import React, { useState, useContext, createContext } from "react";

const context = createContext();

export function PoolPowersProvider(props) {
  const [pools, setPools] = useState([]);

  const { Provider } = context;

  const addPool = (index) => setPools([...pools, index]);
  const removePool = (index) => setPools(pools.filter((i) => i !== index));
  const resetPools = () => setPools([]);
  const state = { pools, addPool, removePool, resetPools };
  return <Provider value={state}>{props.children}</Provider>;
}

export default () => useContext(context);
