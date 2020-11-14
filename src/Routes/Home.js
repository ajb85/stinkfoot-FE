import React from "react";
import { Route } from "react-router-dom";

import Home from "Home/";

export default function PlannerRoutes() {
  return (
    <Route path="/">
      <Home />
    </Route>
  );
}
