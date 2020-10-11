import React, { useContext } from "react";

import { Route, Switch, Redirect } from "react-router-dom";
import Import from "components/Import/";
import BuildList from "components/BuildList/";

import PlannerRoutes from "./Planner.js";
import BadgerRoutes from "./Badger.js";
import { BuildContext } from "Providers/Builds.js";

function Routes(props) {
  const { build } = useContext(BuildContext);
  return (
    <Switch>
      <PlannerRoutes />
      <BadgerRoutes />
      <Route path="/shopper">
        {(window.title = "CoH Shopping List")}
        {Object.keys(build).length ? <BuildList /> : <Import />}
      </Route>
      <Route path="/">
        <Redirect to="/planner" />
      </Route>
    </Switch>
  );
}

export default Routes;
