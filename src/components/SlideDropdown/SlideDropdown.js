import React, { useRef, useEffect, useCallback } from "react";

import styles from "./styles.module.scss";

let timeout;
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
    clearTimeout(timeout);
    if (dropdown.current) {
      if (props.isToggled) {
        timeout = setTimeout(() => {
          dropdown.current.style.overflow = "visible";
        }, 250);
      } else {
        dropdown.current.style.overflow = "hidden";
      }
    }
  }, [props.isToggled]);

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
