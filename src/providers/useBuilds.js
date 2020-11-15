import React, { useState, createContext, useContext } from "react";

// import parseStringToBuild from "js/parseStringToBuild.js";

const BuildContext = createContext();

export function BuildProvider(props) {
  const storage = localStorage.getItem("characters");
  let parsed;
  try {
    parsed = storage && JSON.parse(storage);
  } catch {
    parsed = {};
    localStorage.setItem("character", JSON.stringify(parsed));
  }
  const activeCharName = parsed && localStorage.getItem("activeCharacterName");
  const [characters, setCharacters] = useState(parsed || {});
  const [active, setActive] = useState(activeCharName || "");

  const updateCharacters = (updated) => {
    localStorage.setItem("characters", updated);
    setCharacters(updated);
  };

  const updateActive = (name) => {
    localStorage.setItem("activeCharacterName", JSON.stringify(name));
    setActive(name);
  };

  const updateActiveCharacter = (key, updated) => {
    const updatedCharacters = { ...characters };
    updatedCharacters[active][key] = updated;
    updateCharacters(updatedCharacters);
  };

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
      }}
    >
      {props.children}
    </Provider>
  );
}

export default function useBuild() {
  return useContext(BuildContext);
}
