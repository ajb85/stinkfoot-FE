import React from "react";

import InPlaceAbsolute from "../InPlaceAbsolute/";

import { combineClasses } from "js/utility.js";

import styles from "./styles.module.scss";

export default function MaskOverEnhancement(props) {
  const handleClick = (e) => {
    props.stopProp && e.stopPropagation();
    props.onClick && props.onClick(e);
  };

  return (
    <InPlaceAbsolute zIndex={props.zIndex} onClick={handleClick}>
      <div
        className={combineClasses(styles.MaskOverEnhancement, props.className)}
      >
        {props.children}
      </div>
    </InPlaceAbsolute>
  );
}

MaskOverEnhancement.defaultProps = {
  zIndex: 200,
};
