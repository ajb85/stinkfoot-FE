import React, { createContext, useContext } from "react";
import useCharacters from "../useCharacters.js";

const context = createContext();

export const CharacterDetailsProvider = (props) => {
  const { activeCharacter, updateActiveCharacter } = useCharacters();

  const setCharacterDetail = (e) => {
    const { name: key, value } = e.target;
    updateActiveCharacter(key, value);
  };

  const { name, archetype, origin } = activeCharacter;
  const character = { name, archetype, origin };

  const { Provider } = context;
  const state = { character, setCharacterDetail };
  return <Provider value={state}>{props.children}</Provider>;
};

export default () => useContext(context);
