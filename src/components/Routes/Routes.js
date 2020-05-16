import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Import from 'components/Import/';
import BuildList from 'components/BuildList/';
import Badger from 'Badger/';

import { BuildContext } from 'Providers/Builds.js';

function Routes(props) {
  const { build } = useContext(BuildContext);
  return (
    <Switch>
      <Route path="/shopper">
        {Object.keys(build).length ? <BuildList /> : <Import />}
      </Route>
      <Route path="/badger">
        <Badger />
      </Route>
      <Route>
        <Redirect to="/shopper" />
      </Route>
    </Switch>
  );
}

export default Routes;
