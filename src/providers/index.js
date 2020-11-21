import React from "react";
import { BuildProvider } from "./useBuilds.js";

export default function Providers(props) {
  return <BuildProvider>{props.children}</BuildProvider>;
}
