import React from "react";
import styles from "../styles.module.scss";

import EnhancementSlot from "components/EnhancementSlot/";
import { useRemoveEnhancement } from "hooks/enhancements.js";

import { stopProp } from "js/utility.js";

export default function PowerSlotHeader({ powerSlot, power, powerSlotIndex }) {
  const { level, enhSlots } = powerSlot;
  const removeEnhancement = useRemoveEnhancement(powerSlotIndex);

  const renderNoSlots = () =>
    Array(6 - enhSlots.length)
      .fill(null)
      .map((_, i) => <div key={i} className={styles.noSlot} />);
  return (
    <header className={styles.header} onClick={stopProp}>
      <div>
        <h3>
          ({level}) {power.displayName}
        </h3>
        <p>{power.description.short}</p>
      </div>
      <div>
        {enhSlots.map((s, i) => {
          return (
            <EnhancementSlot
              onClick={
                s.enhancementRef ? removeEnhancement.bind(this, i) : null
              }
              key={i}
              slot={s}
              powerSlotLevel={powerSlot.level}
            />
          );
        })}
        {renderNoSlots()}
      </div>
    </header>
  );
}
