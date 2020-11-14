import React from "react";

import { Route, Switch, Redirect } from "react-router-dom";

import PlannerRoutes from "./Planner.js";
import BadgerRoutes from "./Badger.js";
import ShopperRoutes from "./Shopper.js";
import HomeRoutes from "./Home.js";

function Routes(props) {
  return (
    <Switch>
      <PlannerRoutes />
      <BadgerRoutes />
      <ShopperRoutes />
      <HomeRoutes />
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

export default Routes;
