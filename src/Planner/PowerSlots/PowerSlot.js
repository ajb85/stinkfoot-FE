import React from "react";

import PunnettSquare from "components/PunnettSquare/";
import SlideDropdown from "components/SlideDropdown/";
import EnhancementBar from "components/EnhancementBar/";
import EnhancementSelection from "./EnhancementSelection.js";

import { usePowerSubsections } from "hooks/enhancements.js";
import { useSetNavSection } from "hooks/powerSlots.js";
import {
  useTogglePowerSlot,
  useClearActiveEnhancementSet,
  usePowerFromRef,
} from "hooks/powersets.js";
import useActiveSets from "providers/builder/useActiveSets.js";

import styles from "./styles.module.scss";

function PowerSlot(props) {
  const { slot } = props;
  const { level, powerRef, powerSlotIndex, navigation } = slot;
  const clearActiveEnhancementSet = useClearActiveEnhancementSet();
  const togglePowerSlot = useTogglePowerSlot(powerSlotIndex);
  const { tracking } = useActiveSets();
  const subsections = usePowerSubsections(powerSlotIndex);
  const power = usePowerFromRef(powerRef);

  const isSlottable =
    power && (!!power.allowedEnhancements.length || !!power.setTypes.length);

  const handlePillClick = React.useCallback(
    (e) => {
      e.stopPropagation();
      isSlottable && togglePowerSlot(e);
    },
    [togglePowerSlot, isSlottable]
  );

  const updateNav = useSetNavSection(powerSlotIndex);

  if (!powerRef || !power) {
    const isActive = tracking.activeLevel === level;
    return <EmptyPowerSlot level={level} isActive={isActive} />;
  }

  const isToggled = tracking.toggledSlot === powerSlotIndex;
  const zIndex = isToggled ? props.zIndex + 100 : props.zIndex;
  return (
    <div
      className={styles.powerContainer}
      key={powerSlotIndex}
      style={{ zIndex: zIndex + 1 }}
      onClick={handlePillClick}
    >
      <div className={styles.pill} style={{ zIndex: zIndex + 1 }}>
        <p className="pillText">
          ({level}) {power.displayName}
        </p>
      </div>
      {isSlottable && (
        <EnhancementBar powerSlotIndex={powerSlotIndex} zIndex={zIndex + 2} />
      )}
    </div>
  );
}

function EmptyPowerSlot({ isActive, level }) {
  const { setTrackingManually } = useActiveSets();
  return (
    <div className={styles.powerContainer}>
      <div
        className={styles.power}
        onClick={setTrackingManually.bind(this, "activeLevel", level)}
        style={{ backgroundColor: isActive ? "green" : "grey" }}
      >
        <p>({level})</p>
      </div>
    </div>
  );
}

export default PowerSlot;
