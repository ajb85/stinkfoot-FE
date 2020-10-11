import React from "react";
import { Route } from "react-router-dom";

import Badger from "Badger/";
import { BadgesProvider } from "Providers/Badges.js";

export default function PlannerRoutes() {
  document.title = "Badge Hunter";
  return (
    <Route path="/badger">
      <BadgesProvider>
        <Badger />
      </BadgesProvider>
    </Route>
  );
}
