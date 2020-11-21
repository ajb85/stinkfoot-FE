import React, { useEffect } from "react";

import { openMenu } from "js/closeTracker.js";

const stopProp = (e) => e.stopPropagation();

export default function CloseOnOutsideClick(props) {
  const { isOpen, close } = props;

  useEffect(() => {
    if (isOpen) {
      openMenu(close);
    }
  }, [isOpen, close]);

  return <div onClick={stopProp}>{props.children}</div>;
}
