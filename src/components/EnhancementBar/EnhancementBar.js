import React from "react";

import EnhancementSlot from "../EnhancementSlot/";
import InPlaceAbsolute from "components/InPlaceAbsolute/";

import styles from "./styles.module.scss";

function EnhancementBar(props) {
  if (!props.enhancements) {
    return null;
  }

  return (
    <InPlaceAbsolute parentClassName={styles.EnhancementBar} zIndex={200}>
      {props.enhancements.map((e) => {
        return <EnhancementSlot enhancement={e} />;
      })}
    </InPlaceAbsolute>
  );
}

export default EnhancementBar;
