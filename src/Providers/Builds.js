import React, { useState, createContext } from 'react';

import parseStringToBuild from 'js/parseStringToBuild.js';

export const BuildContext = createContext();

function BuildProvider(props) {
  const storage = localStorage.getItem('builds');
  const builds = storage ? JSON.parse(storage).active : {};
  const [build, setBuild] = useState(builds ? builds : {});

  const _saveBuildToActive = (build) => {
    const builds = JSON.parse(localStorage.getItem('builds')) || {};

    builds.active = build;
    localStorage.setItem('builds', JSON.stringify(builds));
    setBuild(builds.active);
  };

  const saveBuild = (str) => {
    if (!str) {
      setBuild({});
      return;
    }
    _saveBuildToActive(parseStringToBuild(str));
  };

  const _saveUpdatedBuild = (newEnh, setName) => {
    let isComplete = true;

    for (let eName in newEnh) {
      const enh = newEnh[eName];
      if (enh.have < enh.need) {
        isComplete = false;
      }
    }

    const newBuild = {
      ...build,
      enhancements: {
        ...build.enhancements,
        [setName]: {
          ...build.enhancements[setName],
          enhancements: newEnh,
          completed: isComplete,
        },
      },
    };

    _saveBuildToActive(newBuild);
  };

  const toggleEnhancement = (setName, enhName) => {
    const enh = build.enhancements[setName].enhancements[enhName];
    const updatedSet = {
      ...build.enhancements[setName].enhancements,
      [enhName]: {
        ...enh,
        have: enh.have < enh.need ? enh.need : 0,
      },
    };

    _saveUpdatedBuild(updatedSet, setName);
  };

  const decrementCount = (setName, enhName) => {
    const set = { ...build.enhancements[setName].enhancements };
    set[enhName].have =
      set[enhName].have < set[enhName].need
        ? set[enhName].have + 1
        : set[enhName].need;

    _saveUpdatedBuild(set, setName);
  };

  const toggleSet = (setName) => {
    const setCopy = { ...build.enhancements[setName] };
    setCopy.completed = !setCopy.completed;
    const isComplete = setCopy.completed;

    const enhancements = { ...setCopy.enhancements };
    for (let enhName in enhancements) {
      const enh = setCopy.enhancements[enhName];
      enh.have = isComplete ? enh.need : 0;
    }

    const newBuild = {
      ...build,
      enhancements: {
        ...build.enhancements,
        [setName]: { ...setCopy, enhancements },
      },
    };
    _saveBuildToActive(newBuild);
  };

  const { Provider } = BuildContext;
  return (
    <Provider
      value={{ build, saveBuild, toggleEnhancement, toggleSet, decrementCount }}
    >
      {props.children}
    </Provider>
  );
}

export default BuildProvider;
