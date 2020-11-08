import React from "react";

import EnhancementSlot from "../EnhancementSlot/";
import InPlaceAbsolute from "components/InPlaceAbsolute/";

import styles from "./styles.module.scss";

function EnhancementBar(props) {
  if (!props.slots) {
    return null;
  }

  const zIndex = props.zIndex !== undefined ? props.zIndex : 200;

  return (
    <InPlaceAbsolute childClassName={styles.EnhancementBar} zIndex={zIndex}>
      {props.slots.map((s) => {
        return <EnhancementSlot slot={s} />;
      })}
    </InPlaceAbsolute>
  );
}

export default EnhancementBar;
