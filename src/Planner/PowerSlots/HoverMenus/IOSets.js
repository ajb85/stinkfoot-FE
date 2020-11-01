import React from "react";

import SetBonuses from "./SetBonuses.js";
import EnhancementList from "./EnhancementList.js";

import useEnhNavigation from "providers/builder/useEnhancementNavigation.js";

import styles from "../styles.module.scss";

export default function SetPreviewMenu(props) {
  const { display, powerSlotIndex } = props;

  const { enhNavigation } = useEnhNavigation();
  const { displayName, enhancements, setTypeName, levels } = props.set;

  const border = display && display !== "null" ? "1px solid red" : null;
  return (
    <div className={styles.EnhHoverMenu} style={{ display }}>
      <div className={styles.menu} style={{ border }}>
        <div className={styles.titles}>
          <h2>
            {displayName}, {setTypeName}
          </h2>
          <h3>{parseLevels(levels)}</h3>
        </div>
        <EnhancementList
          enhancements={enhancements}
          powerSlotIndex={powerSlotIndex}
        />
        <SetBonuses
          set={props.set}
          powerSlotIndex={powerSlotIndex}
          enhNavigation={enhNavigation}
        />
      </div>
    </div>
  );
}

const parseLevels = ({ min, max }) => {
  return min === max ? `Level ${min}` : `Levels: ${min} - ${max}`;
};
