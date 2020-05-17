import React, { useContext } from 'react';

import { Route, Switch, Redirect } from 'react-router-dom';
import Import from 'components/Import/';
import BuildList from 'components/BuildList/';
import Planner from 'Planner/';
import Badger from 'Badger/';

import DDProvider from 'Providers/DropdownTracking.js';
import StateMgmtProvider from 'Providers/PlannerStateManagement.js';
import BadgeProvider from 'Providers/Badges.js';

import { BuildContext } from 'Providers/Builds.js';

function Routes(props) {
  const { build } = useContext(BuildContext);
  return (
    <Switch>
      <Route path="/planner">
        <DDProvider>
          <StateMgmtProvider>
            <Planner />
          </StateMgmtProvider>
        </DDProvider>
      </Route>
      <Route path="/badger">
        <BadgeProvider>
          <Badger />
        </BadgeProvider>
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
