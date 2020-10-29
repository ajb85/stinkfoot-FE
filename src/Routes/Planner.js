import React from "react";
import { Route } from "react-router-dom";

import Planner from "Planner/";
import { PlannerProvider } from "providers/usePlannerState.js";
import PlannerProviders from "providers/builder/";

export default function PlannerRoutes() {
  document.title = "Character Planner";
  return (
    <Route path="/planner">
      <PlannerProvider>
        <PlannerProviders>
          <Planner />
        </PlannerProviders>
      </PlannerProvider>
    </Route>
  );
}
