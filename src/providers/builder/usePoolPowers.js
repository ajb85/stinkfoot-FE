import React, { useContext, createContext } from "react";
import useCharacters from "../useCharacters.js";
const context = createContext();

export function PoolPowersProvider(props) {
  const { activeCharacter, updateActiveCharacter } = useCharacters();

  const { poolPowers: pools } = activeCharacter;
  const { Provider } = context;

  const setPools = (value) => updateActiveCharacter("poolPowers", value);
  const addPool = (index) => setPools([...pools, index]);
  const removePool = (index) => setPools(pools.filter((i) => i !== index));
  const resetPools = () => setPools([]);
  const state = { pools, addPool, removePool, resetPools };
  return <Provider value={state}>{props.children}</Provider>;
}

export default () => useContext(context);
