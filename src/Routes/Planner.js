import React from "react";
import { Route } from "react-router-dom";

import Planner from "Planner/";
import { PlannerProvider } from "Providers/PlannerStateManagement.js";
import { EnhNavProvider } from "Providers/EnhancementNavigation.js";

export default function PlannerRoutes() {
  document.title = "Character Planner";
  return (
    <Route path="/planner">
      <PlannerProvider>
        <EnhNavProvider>
          <Planner />
        </EnhNavProvider>
      </PlannerProvider>
    </Route>
  );
}
