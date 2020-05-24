import React from 'react';

import { usePlannerState } from 'Providers/PlannerStateManagement.js';

import styles from '../styles.module.scss';

function EnhancementList({ enhancements, powerSlotIndex, addEnh, addFull, removeEnh }) {
  const stateManager = usePlannerState();
  return (
      <div className={styles.hoverContainer}>
          <h3
              className={styles.addFullSet}
              onClick={addFull}
          >
              Add Full Set
          </h3>
    <div className={styles.enhancementContainer}>
      {enhancements.map((enh) => {
        const enhancementIndex = stateManager.findEnhancementIndex(
          enh,
          powerSlotIndex
        );

        const isAdded = enhancementIndex > -1;

        const canBeAdded = !isAdded
          ? stateManager.canEnhancementGoInPowerSlot(enh, powerSlotIndex)
          : null;

        const c = styles.enhancementPill;
        const className = isAdded
          ? c + ' ' + styles.activePill
          : !canBeAdded
          ? c + ' ' + styles.inactivePill
          : c;

        return (
          <p
            key={enh.displayName}
            onClick={handleEnhToggle(addEnh, removeEnh).bind(
              this,
              enh,
              enhancementIndex,
              canBeAdded
            )}
            className={className}
          >
            {stateManager.shortenEnhName(enh.displayName)}
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
