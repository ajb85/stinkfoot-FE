import React, { useEffect } from "react";

import { openMenu, closeMenu } from "js/closeTracker.js";

const stopProp = (e) => e.stopPropagation();

export default function CloseOnOutsideClick(props) {
  const { isOpen, close } = props;

  useEffect(() => {
    if (isOpen) {
      openMenu(close);
    }
    return closeMenu;
  }, [isOpen, close]);

  return <div onClick={stopProp}>{props.children}</div>;
}
