import React from "react";

import NewCharacter from "./components/NewCharacter/";

export default function Home() {
  document.title = "Stinkfoot CoH Companion";
  return (
    <div>
      <NewCharacter />
    </div>
  );
}
