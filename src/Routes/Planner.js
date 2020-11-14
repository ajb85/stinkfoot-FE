import React from "react";
import { Route } from "react-router-dom";

import Planner from "Planner/";
import PlannerProviders from "providers/builder/";

export default function PlannerRoutes() {
  return (
    <Route path="/planner">
      <PlannerProviders>
        <Planner />
      </PlannerProviders>
    </Route>
  );
}
