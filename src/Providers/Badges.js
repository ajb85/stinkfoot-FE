import React, { useState, createContext, useContext } from 'react';
import badgeData from 'Badger/data/';
const BadgesContext = createContext();

export default function BadgesProvider(props) {
  const storage = localStorage.getItem('badges');
  const storedBadges = storage ? JSON.parse(storage) : { characters: {} };
  const badgeState = useState(storedBadges);
  const [badges] = badgeState;

  const { Provider } = BadgesContext;
  return (
    <Provider
      value={{
        badges,
        character: {
          add: addCharacter(badgeState),
          delete: deleteCharacter(badgeState),
          update: updateCharacter(badgeState),
          active: setActiveCharacter(badgeState),
          toggleBadge: toggleComplete(badgeState),
        },
      }}
    >
      {props.children}
    </Provider>
  );
}

const addCharacter = ([badges, setBadges]) => (name) => {
  if (!badges.characters[name]) {
    const newState = { ...badges };
    newState.characters[name] = badgeData;
    newState.active = name;
    saveLocal(newState);
    setBadges(newState);
  }
};

const deleteCharacter = ([badges, setBadges]) => (name) => {
  const newState = { ...badges };
  delete newState.characters[name];

  const chars = Object.keys(newState.characters);

  if (newState.active === name && chars.length > 1) {
    newState.active = chars[0];
  } else if (chars.length === 1) {
    delete newState.active;
    newState.characters = {};
  }

  saveLocal(newState);
  setBadges(newState);
};

const updateCharacter = ([badges, setBadges]) => (name, data) => {
  const newState = {
    ...badges,
    characters: { ...badges.characters, [name]: data },
  };

  saveLocal(newState);
  setBadges(newState);
};

const setActiveCharacter = ([badges, setBadges]) => (e) => {
  const name = e.target.value;

  if (badges.characters[name]) {
    const newState = { ...badges };
    newState.active = name;
    saveLocal(newState);
    setBadges(newState);
  }
};

const toggleComplete = ([badges, setBadges]) => ({
  badgeSection,
  badgeIndex,
}) => {
  const char = badges.active;
  console.log(`TOGGLING ${badgeIndex} in ${badgeSection}`);
  const newFlag = !badges.characters[char][badgeSection][badgeIndex].completed;

  const newState = {
    ...badges,
    characters: {
      ...badges.characters,
      [char]: {
        ...badges.characters[char],
        [badgeSection]: badges.characters[char][badgeSection].map((b, i) => {
          if (i === badgeIndex) {
            return { ...b, completed: newFlag };
          }

          return b;
        }),
      },
    },
  };

  saveLocal(newState);
  setBadges(newState);
};

function saveLocal(data) {
  localStorage.setItem('badges', JSON.stringify(data));
}

export function useBadges(props) {
  return useContext(BadgesContext);
}
