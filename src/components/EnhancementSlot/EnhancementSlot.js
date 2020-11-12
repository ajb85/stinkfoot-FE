import React from "react";

import useCharacterDetails from "providers/builder/useCharacterDetails.js";

import { getEnhancementOverlay } from "helpers/getImages.js";

import styles from "./styles.module.scss";

function EnhancementSlot({ slot, powerSlotLevel, onClick }) {
  const { character } = useCharacterDetails();
  const hasLevel = slot.slotLevel !== undefined;

  const overlay = getEnhancementOverlay(
    character.origin,
    slot.enhancement && slot.enhancement.tier
  );
  return (
    <div className={styles.slot} onClick={noProp}>
      {slot.enhancement ? (
        <div className={styles.enhancement}>
          {overlay && <img src={overlay} alt="enhancement overlay" />}
          <img
            src={slot.enhancement.image}
            alt="enhancement"
            onClick={onClick || noFunc}
          />
        </div>
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
function noProp(e) {
  e.stopPropagation();
}

export default EnhancementSlot;
