import React, { createContext, useContext } from "react";

import useCharacters from "./useCharacters.js";

const BadgesContext = createContext();

export function BadgesProvider(props) {
  const { activeCharacter, updateActiveCharacter } = useCharacters();
  const { badges } = activeCharacter;
  const setBadges = (value) => updateActiveCharacter("badges", value);

  const updateCharacter = (name, data) => {
    const newState = {
      ...badges,
      [name]: data,
    };

    setBadges(newState);
  };

  const toggleComplete = ({ badgeSection, badgeIndex }) => {
    console.log(`TOGGLING ${badgeIndex} in ${badgeSection}`);
    const newFlag = !badges[badgeSection][badgeIndex].completed;

    const newState = {
      ...badges,
      [badgeSection]: badges[badgeSection].map((b, i) => {
        if (i === badgeIndex) {
          return { ...b, completed: newFlag };
        }

        return b;
      }),
    };

    setBadges(newState);
  };

  const { Provider } = BadgesContext;
  return (
    <Provider
      value={{
        badges,
        updateCharacter,
        toggleComplete,
      }}
    >
      {props.children}
    </Provider>
  );
}

export default function useBadges(props) {
  return useContext(BadgesContext);
}
