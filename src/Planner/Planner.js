import React from "react";

import CharacterInfo from "./CharacterInfo/";
import Powersets from "./Powersets/";
import PowerSlots from "./PowerSlots/";

import { useRemoveSlotToggles } from "hooks/powersets";

import styles from "./styles.module.scss";

function Planner(props) {
  console.log("MOUNT PLANNER");
  document.title = "Character Planner";
  const removeSlotToggles = useRemoveSlotToggles();
  return (
    <div className={styles.Planner} onClick={removeSlotToggles}>
      <header>
        <CharacterInfo />
      </header>
      <main>
        <Powersets />
        <PowerSlots />
      </main>
    </div>
  );
}

export default Planner;
