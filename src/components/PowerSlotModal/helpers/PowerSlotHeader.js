import React from "react";
import styles from "../styles.module.scss";

import { stopProp } from "js/utility.js";

export default function PowerSlotHeader({ level, power }) {
  console.log("PROPS: ", power);
  return (
    <header className={styles.header} onClick={stopProp}>
      <div>
        <h3>
          ({level}) {power.displayName}
        </h3>
        <p>{power.description.short}</p>
      </div>
      <div>
        <div className={styles.slot} />
        <div className={styles.slot} />
        <div className={styles.slot} />
        <div className={styles.slot} />
        <div className={styles.slot} />
        <div className={styles.slot} />
      </div>
    </header>
  );
}
