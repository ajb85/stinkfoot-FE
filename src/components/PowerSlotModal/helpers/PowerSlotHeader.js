import React from "react";
import styles from "../styles.module.scss";

export default function PowerSlotHeader(props) {
  return (
    <header className={styles.header}>
      <div>
        <h3>(1) Aimed Shot</h3>
        <p>Ranged Damage</p>
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
