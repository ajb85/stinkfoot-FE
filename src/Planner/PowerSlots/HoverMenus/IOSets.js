import React from "react";

import SetBonuses from "./SetBonuses.js";
import EnhancementList from "./EnhancementList.js";

import usePlannerState from "hooks/usePlannerState.js";
import useEnhNavigation from "hooks/useEnhancementNavigation.js";

import styles from "../styles.module.scss";

export default function SetPreviewMenu(props) {
  const stateManager = usePlannerState();
  const { display, powerSlotIndex } = props;
  const { enhNavigation } = useEnhNavigation();
  const { displayName, enhancements, setTypeName, levels } = props.set;

  const border = display && display !== "null" ? "1px solid red" : null;
  return (
    <div className={styles.EnhHoverMenu} style={{ display }}>
      <div
        className={styles.menu}
        style={{
          border,
        }}
      >
        <div className={styles.titles}>
          <h2>
            {displayName}, {setTypeName}
          </h2>
          <h3>{parseLevels(levels)}</h3>
        </div>
        <EnhancementList
          enhancements={enhancements}
          powerSlotIndex={powerSlotIndex}
          addEnh={addEnh(stateManager, powerSlotIndex, enhNavigation)}
          addFull={addFull(
            stateManager,
            powerSlotIndex,
            enhNavigation,
            enhancements[0].setIndex
          )}
          removeEnh={removeEnh(stateManager, powerSlotIndex)}
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

const addEnh = (stateManager, powerSlotIndex, enhNavigation, level) => (enh) =>
  stateManager.addEnhancement(powerSlotIndex, enh, enhNavigation, level || 50);

const addFull = (stateManager, powerSlotIndex, enhNavigation, setIndex) =>
  stateManager.addFullEnhancementSet.bind(
    this,
    powerSlotIndex,
    enhNavigation,
    setIndex,
    50
  );

const removeEnh = (stateManager, powerSlotIndex) => (enhIndex) =>
  stateManager.removeSlots(powerSlotIndex, enhIndex);

const parseLevels = ({ min, max }) => {
  return min === max ? `Level ${min}` : `Levels: ${min} - ${max}`;
};
