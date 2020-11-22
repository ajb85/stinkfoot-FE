import React from "react";

import Badger from "Badger/";
import Planner from "Planner/";
import Shopper from "Shopper/";
import Home from "Home/";

// import useCharacters from "providers/useBuilds.js";
import { BadgesProvider } from "providers/useBadges.js";
import { ShoppingProvider } from "providers/useShoppingTotals.js";
import PlannerProviders from "providers/builder/";
import useCharacters from "providers/useCharacters.js";

import { Route, Switch, Redirect } from "react-router-dom";

function Routes() {
  const { activeCharacter } = useCharacters();
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      {activeCharacter && (
        <>
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
          <Route path="/shopper">
            <ShoppingProvider>
              <Shopper />
            </ShoppingProvider>
          </Route>
        </>
      )}
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

export default Routes;
