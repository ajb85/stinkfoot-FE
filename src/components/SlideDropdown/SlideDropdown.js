import React, { useRef, useEffect } from "react";

import styles from "./styles.module.scss";

let timeout;
function SlideDropdown(props) {
  const dropdown = useRef();

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
      onClick={stopProp}
    >
      <div className={styles.content} style={{ zIndex: props.zIndex }}>
        {props.children}
      </div>
    </div>
  );
}

function stopProp(e) {
  e.stopPropagation();
}

export default SlideDropdown;
