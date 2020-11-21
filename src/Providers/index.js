import React from "react";
import { BuildProvider } from "./Builds.js";
import { DatabaseProvider } from "./Database.js";

export default function Providers(props) {
  return (
    <BuildProvider>
      <DatabaseProvider>{props.children}</DatabaseProvider>
    </BuildProvider>
  );
}
