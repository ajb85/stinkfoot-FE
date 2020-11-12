import React from "react";

import styles from "./styles.module.scss";

function InPlaceAbsolute(props) {
  const parentClass =
    styles.InPlaceAbsolute +
    (props.parentClassName ? " " + props.parentClassName : "");
  return (
    <div
      style={{ zIndex: props.zIndex || 0 }}
      className={parentClass}
      onClick={props.onClick || noFunc}
    >
      <div className={props.childClassName || ""}>{props.children}</div>
    </div>
  );
}

function noFunc() {}

export default InPlaceAbsolute;
