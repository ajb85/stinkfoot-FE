import React, { useState, createContext, useEffect } from 'react';
import stateMgmt from 'js/plannerStateManager.js';

import styles from 'Planner/PowerSlots/styles.module.scss';

export const PlannerContext = createContext();

let prevInstanceFunction;
function PlannerProvider(props) {
  const [state, setState] = useState(stateMgmt.initialState());
  const stateManager = new stateMgmt(state, setState);

  useEffect(() => {
    const clearActivePills = (e) => {
      const node = findPowerContainerNode(e.target);

      if (!node) {
        if (state.tracking.powerSlotIndex !== null) {
          setState({
            ...state,
            tracking: { ...state.tracking, powerSlotIndex: null },
          });
        }
      }
    };
    if (prevInstanceFunction) {
      window.removeEventListener('click', prevInstanceFunction);
    }
    prevInstanceFunction = clearActivePills;
    window.addEventListener('click', clearActivePills);
    return window.removeEventListener.bind(this, 'click', clearActivePills);
  }, [state]);
  const { Provider } = PlannerContext;
  return <Provider value={stateManager}>{props.children}</Provider>;
}

export default PlannerProvider;

function findPowerContainerNode(node) {
  const classNamesWhiteList = {
    [styles.powerContainer]: true,
    [styles.enhPreviewList]: true,
    [styles.enhPreview]: true,
  };

  while (node && !classNamesWhiteList[node.className] && node.parentNode) {
    node = node.parentNode;
  }

  return node && classNamesWhiteList[node.className] ? node : null;
}
