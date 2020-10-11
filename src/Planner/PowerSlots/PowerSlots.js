import React, { useState, useEffect } from "react";

import usePlannerState from "hooks/usePlannerState.js";
import useEnhNavigation from "hooks/useEnhancementNavigation.js";

import { reducer, mapSelected, getInitialAcc } from "./logic.js";
import styles from "./styles.module.scss";

function PowerSlots(props) {
  const [view] = useState("level");
  const { updateEnhNavigation } = useEnhNavigation();

  const stateManager = usePlannerState();

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
  }, [stateManager.tracking.powerSlotIndex]);

  const { selected /*, defaults*/ } = stateManager
    .getFromState("powerSlots")
    .reduce(reducer(view), getInitialAcc());

  return (
    <section className={styles.PowerSlots}>
      <h2>Power Slots</h2>
      <div className={styles.slotsContainer}>{selected.map(mapSelected)}</div>
    </section>
  );
}

export default PowerSlots;
