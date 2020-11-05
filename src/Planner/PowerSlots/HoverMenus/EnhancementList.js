import React from "react";

import usePowerSlots from "providers/builder/usePowerSlots.js";
import {
  useCanEnhancementGoInPowerSlot,
  useAddEnhancement,
} from "hooks/enhancements.js";

import shortenEnhName from "js/shortenEnhName.js";

import styles from "../styles.module.scss";

function EnhancementList({ enhancements, powerSlotIndex }) {
  const { addEnhancements, removeEnhancement, powerSlots } = usePowerSlots();
  const addEnhancement = useAddEnhancement();
  const canEnhancementGoInPowerSlot = useCanEnhancementGoInPowerSlot(
    powerSlotIndex
  );
  const powerSlot = powerSlots[powerSlotIndex];

  const slottedFromSet = powerSlot.enhSlots.reduce((acc, slot) => {
    if (!slot.enhancement) {
      return acc;
    }

    const i = enhancements.findIndex(
      ({ fullName }) => fullName === slot.enhancement.fullName
    );
    if (i > -1) {
      acc[enhancements[i].fullName] = i;
    }
    return acc;
  }, {});

  return (
    <div className={styles.hoverContainer}>
      <h3
        className={styles.addFullSet}
        onClick={addEnhancements.bind(this, powerSlotIndex, enhancements)}
      >
        Add Full Set
      </h3>
      <div className={styles.enhancementContainer}>
        {enhancements.map((enh) => {
          const enhIndex = slottedFromSet[enh.fullName];
          const isAdded = slottedFromSet[enh.fullName] !== undefined;

          const canBeAdded = !isAdded ? canEnhancementGoInPowerSlot(enh) : null;
          const c = styles.enhancementPill;
          const className = isAdded
            ? c + " " + styles.activePill
            : !canBeAdded
            ? c + " " + styles.inactivePill
            : c;

          return (
            <p
              key={enh.displayName}
              onClick={handleEnhToggle(
                addEnhancement.bind(this, powerSlotIndex),
                removeEnhancement
              ).bind(this, enh, enhIndex, canBeAdded)}
              className={className}
            >
              {shortenEnhName(enh.displayName)}
            </p>
          );
        })}
      </div>
    </div>
  );
}

const handleEnhToggle = (addEnh, removeEnh) => (enh, enhIndex, canBeAdded) => {
  if (canBeAdded && addEnh) {
    addEnh(enh);
  } else if (!canBeAdded && removeEnh) {
    removeEnh(enhIndex);
  }
};

export default EnhancementList;
