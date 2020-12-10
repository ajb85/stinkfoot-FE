import React from "react";
import { CharactersProvider } from "./useCharacters.js";

export default function Providers(props) {
  return <CharactersProvider>{props.children}</CharactersProvider>;
}
