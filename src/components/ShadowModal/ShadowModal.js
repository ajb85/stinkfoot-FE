import React from "react";

import { noFunc } from "js/utility.js";

import styles from "./styles.module.scss";

export default function ShadowModal(props) {
  return (
    <>
      <div className={styles.mask} onClick={props.close || noFunc} />
      <div className={styles.content}>{props.children}</div>
    </>
  );
}
