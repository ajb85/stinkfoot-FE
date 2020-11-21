import React from "react";

// import Import from "components/Import/";
// import BuildList from "components/BuildList/";
import Badger from "Badger/";
import Planner from "Planner/";
import Home from "Home/";

// import useBuild from "providers/useBuilds.js";
import { BadgesProvider } from "providers/useBadges.js";
import PlannerProviders from "providers/builder/";

import { Route, Switch, Redirect } from "react-router-dom";

function Routes() {
  return (
    <Switch>
      <Route path="/planner">
        <PlannerProviders>
          <Planner />
        </PlannerProviders>
      </Route>
      <Route path="/badger">
        <BadgesProvider>
          <Badger />
        </BadgesProvider>
      </Route>
      {/* <Route path="/shopper">
        <Shopper />
      </Route> */}
      <Route exact path="/">
        <Home />
      </Route>
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

export default Routes;

// function Shopper() {
//   const { build } = useBuild();
//   window.title = "Shopping List";
//   return Object.keys(build).length ? <BuildList /> : <Import />;
// }
