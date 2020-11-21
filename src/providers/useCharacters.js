import React, { useState, createContext, useContext, useEffect } from "react";

import origins from "data/origins.js";
import archetypes from "data/archetypes.js";
import powerSlotsTemplate from "data/powerSlotsTemplate.js";

const BuildContext = createContext();

export function BuildProvider(props) {
  const storage = localStorage.getItem("characters");
  let parsed;
  let activeCharName;
  try {
    parsed = storage && JSON.parse(storage);
    activeCharName =
      parsed && JSON.parse(localStorage.getItem("activeCharacterName"));
  } catch {
    parsed = {};
    localStorage.setItem("character", JSON.stringify(parsed));
  }

  const [characters, setCharacters] = useState(parsed || {});
  const [active, setActive] = useState(activeCharName || "");

  console.log("ACTIVE: ", active, characters, characters[active]);
  const updateCharacters = (updated) => {
    localStorage.setItem("characters", JSON.stringify(updated));
    setCharacters(updated);
  };

  const updateActive = (name) => {
    localStorage.setItem("activeCharacterName", JSON.stringify(name));
    setActive(name);
  };

  const updateActiveCharacter = (key, value) => {
    const updatedActive = { ...characters[active] };
    updatedActive[key] = value;
    updateCharacters({ ...characters, [active]: updatedActive });
  };

  const createNewCharacter = (name, makeActive = true) => {
    const updatedChars = { ...characters };
    if (!updatedChars[name]) {
      updatedChars[name] = getNewCharacter(name);

      if (makeActive) {
        updateActive(name);
      }
    }
    updateCharacters(updatedChars);
  };

  useEffect(() => {
    if (!active) {
      console.log("SETTING ACTIVE CHAR NAME");
      const charNames = Object.keys(characters);
      if (charNames.length) {
        updateActive(charNames[0]);
      }
    }
  }, [characters, active]);

  const { Provider } = BuildContext;
  const charCount = Object.keys(characters).length;
  return (
    <Provider
      value={{
        characters,
        activeCharacter: charCount > 0 && active ? characters[active] : null,
        updateCharacters,
        updateActive,
        updateActiveCharacter,
        createNewCharacter,
      }}
    >
      {props.children}
    </Provider>
  );
}

export default function useCharacters() {
  return useContext(BuildContext);
}

function getNewCharacter(name) {
  return {
    name: name || "",
    archetype: archetypes[0],
    origin: origins[0].name,
    powerSlots: powerSlotsTemplate,
    poolPowers: [],
    badges: {},
  };
}