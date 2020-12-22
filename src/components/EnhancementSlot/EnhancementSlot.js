import React from "react";

import MaskOverEnhancement from "../MaskOverEnhancement/";
import OnScreenHover from "../OnScreenHover/";

import useCharacterDetails from "providers/builder/useCharacterDetails.js";
import { getEnhancementOverlay } from "js/getImage.js";
import { useEnhancementFromRef } from "hooks/enhancements.js";

import styles from "./styles.module.scss";

function EnhancementSlot({ slot, powerSlotLevel, onClick }) {
  const { character } = useCharacterDetails();
  const hasLevel = slot && slot.slotLevel !== undefined;

  const overlay =
    slot &&
    slot.enhancementRef &&
    getEnhancementOverlay(
      character.origin,
      slot.enhancementRef && slot.enhancementRef.tier
    );

  const enhancement = useEnhancementFromRef(slot && slot.enhancementRef);
  const isEmpty = !enhancement;

  return (
    <div className={styles.slot} data-testid="enhancementSlot">
      {!isEmpty ? (
        <div className={styles.enhancement} onClick={onClick || noFunc}>
          <OnScreenHover className={styles.hoverInfo}>
            <>
              <h4>{enhancement.setDisplayName}</h4>
              <p>{enhancement.displayName}</p>
            </>
          </OnScreenHover>
          <MaskOverEnhancement className={styles.removeEnh}>
            X
          </MaskOverEnhancement>
          {overlay && <img src={overlay} alt="enhancement overlay" />}
          <img src={enhancement.image} alt="enhancement" />
        </div>
      ) : (
        <div className={styles.empty} />
      )}
      {hasLevel && (
        <div className={!isEmpty ? styles.level : styles.emptyLevel}>
          {slot.slotLevel || powerSlotLevel}
        </div>
      )}
    </div>
  );
}

function noFunc() {}

export default EnhancementSlot;
