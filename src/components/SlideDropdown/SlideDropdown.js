import React from "react";

import styles from "./styles.module.scss";

function SlideDropdown(props) {
  return (
    <div
      className={
        styles.SlideDropdown + (props.isToggled ? " " + styles.toggled : "")
      }
      onClick={stopProp}
    >
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}

function stopProp(e) {
  e.stopPropagation();
}

export default SlideDropdown;
