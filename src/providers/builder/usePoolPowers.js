import React, { useState, useContext, createContext, useCallback } from "react";

const context = createContext();

export function PoolPowersProvider(props) {
  const [pools, setPools] = useState([]);

  const { Provider } = context;

  const addPool = useCallback((index) => setPools([...pools, index]), [pools]);
  const removePool = useCallback(
    (index) => setPools(pools.filter((i) => i !== index)),
    [pools]
  );
  const state = { pools, addPool, removePool };
  return <Provider value={state}>{props.children}</Provider>;
}

export default () => useContext(context);
