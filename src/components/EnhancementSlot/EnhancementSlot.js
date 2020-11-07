import React from "react";

import styles from "styles.module.scss";

function EnhancementSlot(props) {
  return (
    <div className={styles.slot}>
      {props.enhancement ? (
        <div onClick={props.onClick}>H</div>
      ) : (
        <div className={styles.empty} />
      )}
      {props.level && <div className={styles.level}>{props.level}</div>}
    </div>
  );
}

export default EnhancementSlot;
