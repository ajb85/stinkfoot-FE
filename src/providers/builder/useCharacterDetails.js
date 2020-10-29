import React, { useState, createContext, useContext, useCallback } from "react";

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

  const { Provider } = context;

  const setCharacterDetail = useCallback(
    (key, value) => {
      if (!character[key]) {
        // Helper error
        const allKeys = Object.keys(character).join(", ");
        throw new Error(
          `Char details cannot find ${key}.  Available: ${allKeys}`
        );
      }

      setCharacter({ ...character, [key]: value });
    },
    [character]
  );

  const state = { character, setCharacterDetail };

  return <Provider value={state}>{props.children}</Provider>;
};

export const allOrigins = origins;

export default () => useContext(context);
