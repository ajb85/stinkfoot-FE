import React from "react";

import EnhancementSlot from "../EnhancementSlot/";
import InPlaceAbsolute from "components/InPlaceAbsolute/";

import { useRemoveEnhancement } from "hooks/enhancements.js";
import usePowerSlots from "providers/builder/usePowerSlots.js";

import styles from "./styles.module.scss";

function EnhancementBar(props) {
  const removeEnhancement = useRemoveEnhancement(props.powerSlotIndex);
  const { powerSlots } = usePowerSlots();

  if (props.powerSlotIndex === undefined) {
    return null;
  }

  const powerSlot = powerSlots[props.powerSlotIndex];
  const zIndex = props.zIndex !== undefined ? props.zIndex : 200;

  return (
    <InPlaceAbsolute
      childClassName={styles.EnhancementBar}
      zIndex={zIndex}
      onClick={noProp}
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
    </InPlaceAbsolute>
  );
}

function noProp(e) {
  e.stopPropagation();
}

export default EnhancementBar;
