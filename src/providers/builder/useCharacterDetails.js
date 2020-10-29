import React, { useState, createContext, useContext } from "react";

import origins from "data/origins.js";
import archetypes from "data/archetypes.js";

const initialState = {
  name: "",
  archetype: archetypes[0],
  origin: origins[0].name,
  alignment: "Hero",
};

const context = createContext();

export const CharacterDetailsProvider = (props) => {
  const [character, setCharacter] = useState(initialState);

  const setCharacterDetail = (e) => {
    const { name, value } = e.target;
    setCharacter({ ...character, [name]: value });
  };

  const { Provider } = context;
  const state = { character, setCharacterDetail };
  return <Provider value={state}>{props.children}</Provider>;
};

export default () => useContext(context);
