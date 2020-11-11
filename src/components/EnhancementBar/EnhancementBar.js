import React from "react";

import EnhancementSlot from "../EnhancementSlot/";
import InPlaceAbsolute from "components/InPlaceAbsolute/";

import styles from "./styles.module.scss";

function EnhancementBar(props) {
  if (!props.powerSlot) {
    return null;
  }

  const zIndex = props.zIndex !== undefined ? props.zIndex : 200;

  return (
    <InPlaceAbsolute childClassName={styles.EnhancementBar} zIndex={zIndex}>
      {props.powerSlot.enhSlots.map((s, i) => {
        return (
          <EnhancementSlot
            key={s.slotLevel || i}
            slot={s}
            powerSlotLevel={props.powerSlot.level}
          />
        );
      })}
    </InPlaceAbsolute>
  );
}

export default EnhancementBar;
