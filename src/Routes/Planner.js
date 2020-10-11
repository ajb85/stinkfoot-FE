import React from "react";
import { Route } from "react-router-dom";

import Planner from "Planner/";
import { PlannerProvider } from "hooks/usePlannerState.js";
import { EnhNavProvider } from "hooks/useEnhancementNavigation.js";

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
