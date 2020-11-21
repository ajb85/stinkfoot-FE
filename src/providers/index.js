import React from "react";
import { BuildProvider } from "./useCharacters.js";

export default function Providers(props) {
  return <BuildProvider>{props.children}</BuildProvider>;
}
