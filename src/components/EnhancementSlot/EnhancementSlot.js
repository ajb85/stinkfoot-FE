import React from "react";

import styles from "./styles.module.scss";

function EnhancementSlot(props) {
  return (
    <div className={styles.slot}>
      {props.slot.enhancement ? (
        <div onClick={props.onClick}>H</div>
      ) : (
        <div className={styles.empty} />
      )}
      {props.slotLevel && <div className={styles.level}>{props.slotLevel}</div>}
    </div>
  );
}

function noFunc() {}

export default EnhancementSlot;
