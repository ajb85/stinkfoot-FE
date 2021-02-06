import React from "react";
import styles from "../styles.module.scss";

import EnhancementSlot from "components/EnhancementSlot/";
import EnhancementBar from "components/EnhancementBar/";
import { useRemoveEnhancement } from "hooks/enhancements.js";

import { stopProp } from "js/utility.js";

export default function PowerSlotHeader({ powerSlot, power, powerSlotIndex }) {
  const { level, enhSlots } = powerSlot;
  const removeEnhancement = useRemoveEnhancement(powerSlotIndex);

  return (
    <header className={styles.header} onClick={stopProp}>
      <div>
        <h3>
          ({level}) {power.displayName}
        </h3>
        <p>{power.description.short}</p>
      </div>
      <EnhancementBar
        powerSlotIndex={powerSlotIndex}
        position="right"
        noSlots
      />
    </header>
  );
}
