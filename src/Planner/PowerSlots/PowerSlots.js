import React, { useState, useEffect, useCallback } from "react";

// import useEnhNavigation from "providers/builder/useEnhancementNavigation.js";
// import useActiveSets from "providers/builder/useActiveSets.js";
import usePowerSlots from "providers/builder/usePowerSlots.js";
import { useNextActiveLevel } from "hooks/powersets.js";

import { reducer, mapSelected, getInitialAcc } from "./logic.js";

import styles from "./styles.module.scss";

function PowerSlots(props) {
  const [view, setView] = useState("level");
  const { powerSlots } = usePowerSlots();
  // const { tracking } = useActiveSets();
  const toggleView = useCallback(
    () => setView(view === "level" ? "respec" : "level"),
    [view]
  );
  const updateActiveLevel = useNextActiveLevel();

  useEffect(() => {
    updateActiveLevel();
  }, [powerSlots]); // eslint-disable-line

  const { selected /*, defaults*/ } = powerSlots.reduce(
    reducer(view),
    getInitialAcc()
  );

  return (
    <section className={styles.PowerSlots}>
      <button onClick={toggleView}>Toggle View</button>
      <h2>Power Slots</h2>
      <div className={styles.slotsContainer}>{selected.map(mapSelected)}</div>
    </section>
  );
}

export default PowerSlots;
