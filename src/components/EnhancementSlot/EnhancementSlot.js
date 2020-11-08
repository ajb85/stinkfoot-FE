import React from "react";

import styles from "./styles.module.scss";

function EnhancementSlot({ slot, powerSlotLevel, onClick }) {
  const hasLevel = slot.slotLevel !== undefined;
  return (
    <div className={styles.slot}>
      {slot.enhancement ? (
        <div onClick={onClick || noFunc}>H</div>
      ) : (
        <div className={styles.empty} />
      )}
      {hasLevel && (
        <p className={styles.level}>{slot.slotLevel || powerSlotLevel}</p>
      )}
    </div>
  );
}

function noFunc() {}

export default EnhancementSlot;
