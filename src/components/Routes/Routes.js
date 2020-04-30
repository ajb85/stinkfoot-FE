import React, { useContext } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Import from 'components/Import/';
import BuildList from 'components/BuildList/';
import Planner from 'Planner/';

import DDProvider from 'Providers/DropdownTracking.js';
import { BuildContext } from 'Providers/Builds.js';

function Routes(props) {
  const { build } = useContext(BuildContext);
  return (
    <Switch>
      <Route path="/planner">
        <DDProvider>
          <Planner />
        </DDProvider>
      </Route>
      <Route path="/shopper">
        {Object.keys(build).length ? <BuildList /> : <Import />}
      </Route>
      <Route path="/">
        <Redirect to="/planner" />
      </Route>
    </Switch>
  );
}

export default Routes;
