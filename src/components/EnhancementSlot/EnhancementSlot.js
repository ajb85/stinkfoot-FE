import React from "react";

import MaskOverEnhancement from "../MaskOverEnhancement/";
import OnScreenHover from "../OnScreenHover/";

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
    <div className={styles.slot} data-testid="enhancementSlot">
      {slot.enhancement ? (
        <div className={styles.enhancement} onClick={onClick || noFunc}>
          <OnScreenHover className={styles.hoverInfo}>
            <>
              <h4>{slot.enhancement.setDisplayName}</h4>
              <p>{slot.enhancement.displayName}</p>
            </>
          </OnScreenHover>
          <MaskOverEnhancement className={styles.removeEnh}>
            X
          </MaskOverEnhancement>
          {overlay && <img src={overlay} alt="enhancement overlay" />}
          <img src={slot.enhancement.image} alt="enhancement" />
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

export default EnhancementSlot;
