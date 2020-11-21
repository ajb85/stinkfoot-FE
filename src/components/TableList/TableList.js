import React from "react";

import styles from "./styles.module.scss";

export default function TableList(props) {
  return (
    <div className={styles.TableList}>
      {props.list.map(({ display, value }) => (
        <div key={display}>
          <p>{display}</p>
          <p>{value.sum}</p>
        </div>
      ))}
    </div>
  );
}
