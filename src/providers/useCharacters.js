import React, { useState, createContext, useContext, useEffect } from "react";

import origins from "data/origins.js";
import archetypes from "data/archetypes.js";
import powerSlotsTemplate from "data/powerSlotsTemplate.js";
import badgeData from "Badger/data/";

import { prepareCharacterForStorage } from "js/characterStorageConversion.js";

const BuildContext = createContext();

export function CharactersProvider(props) {
  const storage = localStorage.getItem("characters");
  let parsed;
  let activeCharName;
  try {
    if (!storage) {
      throw new Error();
    }
    parsed = storage && JSON.parse(storage);
    activeCharName =
      parsed && JSON.parse(localStorage.getItem("activeCharacterName"));
  } catch {
    parsed = {};
    localStorage.setItem("characters", JSON.stringify(parsed));
  }

  const [characters, setCharacters] = useState(parsed || {});
  const [active, setActive] = useState(activeCharName || "");

  const updateCharacterInStorage = (charName, updated) => {
    const storage = JSON.parse(localStorage.getItem("characters"));
    storage[charName] = prepareCharacterForStorage(updated);
    localStorage.setItem("characters", JSON.stringify(storage));
  };

  const updateCharacters = (updated) => {
    localStorage.setItem("characters", JSON.stringify(updated));
    setCharacters(updated);
  };

  const updateActive = (name) => {
    localStorage.setItem("activeCharacterName", JSON.stringify(name));
    setActive(name);
  };

  const updateActiveCharacter = ((updatedActive, timeout) => (key, value) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    if (!updatedActive) {
      updatedActive = { ...characters[active] };
    }

    updatedActive[key] = value;

    timeout = setTimeout(() => {
      updateCharacterInStorage(active, updatedActive);
      setCharacters({ ...characters, [active]: updatedActive });
      updatedActive = null;
      timeout = null;
    }, 50);
  })();

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
      const charNames = Object.keys(characters);
      if (charNames.length) {
        updateActive(charNames[0]);
      }
    }
  }, [characters, active]);

  const { Provider } = BuildContext;
  const characterList = Object.keys(characters);

  const activeCharacter =
    characterList.length > 0
      ? active
        ? characters[active]
        : characters[characterList[0]]
      : null;

  return (
    <Provider
      value={{
        characters,
        activeCharacter,
        characterList,
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
    badges: badgeData,
  };
}
