import React, { useState, useEffect, useRef } from "react";
import InPlaceAbsolute from "../InPlaceAbsolute/";

import getScrollbarWidth from "js/getScrollbarWidth.js";

// import styles from "./styles.module.scss";

export default function OnScreenHover(props) {
  const [hoverPosition, setHoverPosition] = useState({});
  const hoverMenu = useRef();

  useEffect(() => {
    // Should eventually update on window changing size
    if (hoverMenu.current) {
      setHoverPosition(getHoverMenuPosition(hoverMenu.current));
    } else {
      setHoverPosition({});
    }
  }, []);

  return (
    <InPlaceAbsolute zIndex={props.zIndex} parentClassName={props.className}>
      <div ref={hoverMenu} style={hoverPosition}>
        {props.children}
      </div>
    </InPlaceAbsolute>
  );
}

OnScreenHover.defaultProps = {
  zIndex: 200,
};

function getHoverMenuPosition(element) {
  if (element) {
    const { x, width } = element.getBoundingClientRect();
    const windowSize = getWindowSize();
    const padding = 5;

    if (width < windowSize.width) {
      if (x < padding || element.style.left) {
        const left = element.style.left || Math.abs(x) + padding;
        return { left };
      } else if (
        x + width + padding > windowSize.width ||
        element.style.right
      ) {
        const right =
          element.style.right || x + width + padding - windowSize.width;
        return { right };
      }
    }
  }
  return {};
}

function getWindowSize() {
  const scrollBarWidth = getScrollbarWidth();
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  const height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  return { width: width - scrollBarWidth, height };
}
