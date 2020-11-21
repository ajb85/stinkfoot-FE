import React, { useState, createContext } from 'react';
import stateMgmt from 'js/plannerStateManager.js';

export const PlannerContext = createContext();

function PlannerProvider(props) {
  const [state, setState] = useState(stateMgmt.initialState());
  const stateManager = new stateMgmt(state, setState);
  console.log('STATE: ', stateManager.state);

  const { Provider } = PlannerContext;
  return <Provider value={stateManager}>{props.children}</Provider>;
}

export default PlannerProvider;
