import React, { useState, useCallback, createContext, useContext } from "react";

const Context = createContext();

const initialState = {
  section: "standard",
  tier: "IO",
  ioSetIndex: null,
  showSuperior: true,
};

export const EnhNavProvider = (props) => {
  const [enhNavigation, setEnhNavigation] = useState(initialState);

  const updateEnhNavigation = useCallback(
    (newProps) => setEnhNavigation({ ...enhNavigation, ...newProps }),
    [enhNavigation]
  );

  const state = {
    enhNavigation,
    updateEnhNavigation,
    setEnhNavigation,
  };

  const { Provider } = Context;
  return <Provider value={state}>{props.children}</Provider>;
};

export default () => useContext(Context);
