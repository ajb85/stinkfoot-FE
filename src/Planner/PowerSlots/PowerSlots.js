import React, { useState, useCallback } from "react";

import PowerSlot from "./PowerSlot.js";
import PowerSlotModal from "components/PowerSlotModal/";

import usePowerSlots from "providers/builder/usePowerSlots.js";

import { reducer, getInitialAcc, elementsPerIndex } from "./logic.js";

import styles from "./styles.module.scss";

function PowerSlots(props) {
  const [view, setView] = useState("level");
  const { powerSlots } = usePowerSlots();
  // const { tracking } = useActiveSets();
  const toggleView = useCallback(
    () => setView(view === "level" ? "respec" : "level"),
    [view]
  );

  const { selected /*, defaults*/ } = powerSlots.reduce(
    reducer(view),
    getInitialAcc()
  );

  const getZIndex = ((count) => () => {
    for (let i = 0; i < elementsPerIndex; i++) {
      count--;
    }
    return count;
  })(
    elementsPerIndex *
      selected.reduce((count, column) => count + column.length, 0) // + defaults.length + empties.length
  );

  return (
    <>
      <section className={styles.PowerSlots}>
        <button onClick={toggleView}>Toggle View</button>
        <h2>Power Slots</h2>
        <div className={styles.slotsContainer}>
          {selected.map((column, columnIndex) => {
            return (
              <div key={columnIndex} className={styles.column}>
                {column.map((ps) => (
                  <PowerSlot
                    key={ps.powerSlotIndex}
                    slot={ps}
                    zIndex={getZIndex()}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </section>
      <PowerSlotModal />
    </>
  );
}

export default PowerSlots;
