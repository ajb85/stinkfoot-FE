import React from "react";
import { BuildProvider } from "./useBuilds.js";
import { DatabaseProvider } from "./useDatabase.js";

export default function Providers(props) {
  return (
    <BuildProvider>
      <DatabaseProvider>{props.children}</DatabaseProvider>
    </BuildProvider>
  );
}
