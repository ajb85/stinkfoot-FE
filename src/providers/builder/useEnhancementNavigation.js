import React, { useState, useCallback, createContext, useContext } from "react";

const Context = createContext();

const initialState = {
  section: "standard",
  tier: "IO",
  setType: null,
  setIndex: null,
  showSuperior: true,
};

export const EnhNavProvider = (props) => {
  const [enhNavigation, setEnhNavigation] = useState(initialState);

  const updateEnhNavigation = (newProps) =>
    setEnhNavigation({ ...enhNavigation, ...newProps });

  const viewStandardEnhancements = (tier = "IO") =>
    setEnhNavigation({
      tier,
      section: "standard",
      setType: null,
      setIndex: null,
    });

  const viewIOSets = (setType = 0, setIndex = null) =>
    setEnhNavigation({
      section: "sets",
      tier: "IO",
      setType,
      setIndex,
    });

  const toggleSuperiorSets = () =>
    setEnhNavigation({
      showSuperior: !enhNavigation.showSuperior,
    });

  const viewEnhancementSubSection = (sub) => {
    const isSet = !isNaN(Number(sub));
    const key = isSet ? "setType" : "tier";
    updateEnhNavigation({ [key]: sub });
  };

  const toggleIOSet = (setIndex = 0) =>
    updateEnhNavigation({
      setIndex: enhNavigation.setIndex === null ? setIndex : null,
    });

  const state = {
    enhNavigation,
    viewStandardEnhancements,
    viewIOSets,
    toggleSuperiorSets,
    viewEnhancementSubSection,
    toggleIOSet,
  };

  const { Provider } = Context;
  return <Provider value={state}>{props.children}</Provider>;
};

export default () => useContext(Context);
