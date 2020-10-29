import React from "react";

import { Route, Switch, Redirect } from "react-router-dom";
import Import from "components/Import/";
import BuildList from "components/BuildList/";

import PlannerRoutes from "./Planner.js";
import BadgerRoutes from "./Badger.js";
import useBuild from "providers/useBuilds.js";

function Routes(props) {
  const { build } = useBuild();
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
