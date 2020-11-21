import React from "react";
import { Route } from "react-router-dom";

import Planner from "Planner/";
import StateMgmtProvider from "Providers/PlannerStateManagement.js";
import { EnhNavProvider } from "Providers/EnhancementNavigation.js";

export default function PlannerRoutes() {
  document.title = "Character Planner";
  return (
    <Route path="/planner">
      <StateMgmtProvider>
        <EnhNavProvider>
          <Planner />
        </EnhNavProvider>
      </StateMgmtProvider>
    </Route>
  );
}
