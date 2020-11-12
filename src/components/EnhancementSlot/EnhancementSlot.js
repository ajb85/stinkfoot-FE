import React from "react";

import styles from "./styles.module.scss";

function EnhancementSlot({ slot, powerSlotLevel, onClick }) {
  const hasLevel = slot.slotLevel !== undefined;

  return (
    <div className={styles.slot}>
      {slot.enhancement ? (
        <img
          src={slot.enhancement.image}
          alt="enhancement"
          onClick={onClick || noFunc}
        />
      ) : (
        <div className={styles.empty} />
      )}
      {hasLevel && (
        <div className={styles.level}>{slot.slotLevel || powerSlotLevel}</div>
      )}
    </div>
  );
}

function noFunc() {}

export default EnhancementSlot;
