import React, { useContext } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Import from 'components/Import/';
import BuildList from 'components/BuildList/';
import Planner from 'Planner/';

import { BuildContext } from 'Providers/Builds.js';

function Routes(props) {
  const { build } = useContext(BuildContext);
  return (
    <Switch>
      <Route path="/planner">
        <Planner />
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
