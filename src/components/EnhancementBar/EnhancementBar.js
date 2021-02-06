import React from "react";

import EnhancementSlot from "../EnhancementSlot/";
import InPlaceAbsolute from "components/InPlaceAbsolute/";

import { useRemoveEnhancement } from "hooks/enhancements.js";
import usePowerSlots from "providers/builder/usePowerSlots.js";

import { combineClasses } from "js/utility.js";

import styles from "./styles.module.scss";

function EnhancementBar(props) {
  const removeEnhancement = useRemoveEnhancement(props.powerSlotIndex);
  const { powerSlots } = usePowerSlots();

  if (props.powerSlotIndex === undefined) {
    return null;
  }

  const renderNoSlots = () =>
    Array(6 - powerSlot.enhSlots.length)
      .fill(null)
      .map((_, i) => <div key={i} className={styles.noSlot} />);

  const powerSlot = powerSlots[props.powerSlotIndex];
  const zIndex = props.zIndex !== undefined ? props.zIndex : 200;

  return (
    <InPlaceAbsolute
      childClassName={combineClasses(
        styles.EnhancementBar,
        props.position === "hang" && styles.hangingBar,
        props.position === "center" && styles.centerBar,
        props.position === "right" && styles.rightBar
      )}
      onClick={noProp}
      zIndex={zIndex}
    >
      {powerSlot.enhSlots.map((s, i) => {
        return (
          <EnhancementSlot
            onClick={s.enhancementRef ? removeEnhancement.bind(this, i) : null}
            key={i}
            slot={s}
            powerSlotLevel={powerSlot.level}
          />
        );
      })}
      {props.noSlots && renderNoSlots()}
    </InPlaceAbsolute>
  );
}

function noProp(e) {
  e.stopPropagation();
}

export default EnhancementBar;
