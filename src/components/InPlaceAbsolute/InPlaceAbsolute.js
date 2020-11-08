import React from "react";

import styles from "./styles.module.scss";

function InPlaceAbsolute(props) {
  const parentClass =
    styles.InPlaceAbsolute +
    (props.parentClassName ? " " + props.parentClassName : "");
  return (
    <div style={{ zIndex: props.zIndex || 0 }} className={parentClass}>
      <div className={props.childClassName || ""}>{props.children}</div>
    </div>
  );
}

export default InPlaceAbsolute;
