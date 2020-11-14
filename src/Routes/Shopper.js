import React from "react";
import { Route } from "react-router-dom";

import Import from "components/Import/";
import BuildList from "components/BuildList/";

import useBuild from "providers/useBuilds.js";

export default function PlannerRoutes() {
  return (
    <Route path="/shopper">
      <Shopper />
    </Route>
  );
}

function Shopper() {
  const { build } = useBuild();
  window.title = "Shopping List";
  return Object.keys(build).length ? <BuildList /> : <Import />;
}
