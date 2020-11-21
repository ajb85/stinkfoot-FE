import React, { useRef, useEffect, useCallback } from "react";

import styles from "./styles.module.scss";

const timeouts = {};
function SlideDropdown(props) {
  const dropdown = useRef();
  const { onClick } = props;

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      onClick && onClick();
    },
    [onClick]
  );

  useEffect(() => {
    clearTimeout(timeouts[props.powerSlotIndex]);
    if (props.isToggled) {
      timeouts[props.powerSlotIndex] = setTimeout(() => {
        dropdown.current && (dropdown.current.style.overflow = "visible");
        delete timeouts[props.powerSlotIndex];
      }, 250);
    } else {
      dropdown.current && (dropdown.current.style.overflow = "hidden");
    }
  }, [props.isToggled, props.powerSlotIndex]);

  return (
    <div
      ref={dropdown}
      className={
        styles.SlideDropdown + (props.isToggled ? " " + styles.toggled : "")
      }
      onClick={handleClick}
    >
      <div className={styles.content} style={{ zIndex: props.zIndex }}>
        {props.children}
      </div>
    </div>
  );
}

export default SlideDropdown;
