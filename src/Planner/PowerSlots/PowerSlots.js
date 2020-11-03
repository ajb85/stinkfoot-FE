import React, { useState, useEffect, useCallback } from "react";

import useEnhNavigation from "providers/builder/useEnhancementNavigation.js";
import usePowerSlots from "providers/builder/usePowerSlots.js";
import useActiveSets from "providers/builder/useActiveSets.js";
import { useNextActiveLevel } from "hooks/powersets.js";

import { reducer, mapSelected, getInitialAcc } from "./logic.js";

import styles from "./styles.module.scss";

function PowerSlots(props) {
  const [view, setView] = useState("level");
  const { updateEnhNavigation } = useEnhNavigation();
  const { powerSlots } = usePowerSlots();
  const { tracking } = useActiveSets();
  const toggleView = useCallback(
    () => setView(view === "level" ? "respec" : "level"),
    [view]
  );
  const updateActiveLevel = useNextActiveLevel();

  useEffect(() => {
    // Resets navigation whenever a power is opened or closed.  A more long term solution
    // would probably be to store the state for every power slot so there can be a memory of where
    // the user was last time they selected a slot
    updateEnhNavigation({
      section: "standard",
      tier: "IO",
      ioSetIndex: null,
    });
    // eslint-disable-next-line
  }, [tracking.powerSlot]);

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
