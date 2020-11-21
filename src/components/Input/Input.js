import React from "react";
import { FormInput } from "shards-react";

// import { noFunc } from "js/utility.js";

import styles from "./styles.module.scss";

export default function Input(props) {
  return (
    <label className={styles.Input}>
      {props.label || ""}
      <FormInput placeholder={props.placeholder} />
    </label>
  );
}
