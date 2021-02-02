import React, { useCallback } from "react";

import NavSlider from "components/NavSlider/";

import { combineClasses, stopProp } from "js/utility.js";
import {
  usePowerSubsections,
  useEnhancementsForPowerSlot,
  useGetEnhancementOverlay,
} from "hooks/enhancements.js";
import shortenEnhName from "js/shortenEnhName.js";

import styles from "../styles.module.scss";

export default function EnhancementSelection({
  nav,
  updateEnhancementNav,
  powerSlotIndex,
}) {
  const tab = nav.section;
  const isSet = tab === "sets";
  const subsections = usePowerSubsections(powerSlotIndex);
  const enhCategoryLookup = useEnhancementsForPowerSlot(powerSlotIndex);

  const setType = isSet
    ? nav.setType === null
      ? Object.keys(enhCategoryLookup)[0] // No navigation yet
      : nav.setType // Use setType if it exists
    : nav.tier; // Use navigation tier if standard

  const setIndex =
    !isSet || nav.setIndex === null
      ? 0 // No navigation yet or is standard (only 1 index)
      : nav.setIndex; // use setIndex if it exists
  const activeSubIndex = subsections.findIndex((s) => s.setType === setType);

  const categoryList = enhCategoryLookup[isSet ? setType : "standard"];
  const overlay = useGetEnhancementOverlay()(isSet ? "IO" : setType);

  const setActiveIndex = useCallback(
    (index) => {
      updateEnhancementNav(
        isSet ? "setType" : "tier",
        subsections[index].setType
      );
    },
    [updateEnhancementNav, isSet, subsections]
  );

  const handleEnhancementClick = (enhancement) => {
    if (isSet) {
      updateEnhancementNav("setIndex", enhancement.setIndex);
    }
  };

  return (
    <div className={styles.enhancementSelection} onClick={stopProp}>
      <div className={styles.tabs}>
        <h3
          className={combineClasses(!isSet && styles.activeTab)}
          onClick={updateEnhancementNav.bind(null, "section", "standard")}
        >
          Standard
        </h3>
        <h3
          className={combineClasses(isSet && styles.activeTab)}
          onClick={updateEnhancementNav.bind(null, "section", "sets")}
        >
          Sets
        </h3>
      </div>
      <div className={styles.tabContent}>
        <NavSlider
          activeIndex={activeSubIndex}
          setActiveIndex={setActiveIndex}
          categories={subsections.map(({ name }) => name)}
        />
        <div className={styles.renderEnh}>
          {renderEnhancements(
            overlay,
            categoryList,
            setIndex,
            handleEnhancementClick
          )}
        </div>
      </div>
      {isSet && (
        <div className={styles.setEnhancementsContainer}>
          <h3>Set Enhancements</h3>
          <div className={styles.setEnhancements}>
            {renderSet(
              overlay,
              (categoryList[setIndex] || categoryList[0]).enhancements
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function renderEnhancements(overlay, list, active, cb) {
  const isSet = list[0].setType !== undefined;
  return list.map((enhancement, i) => {
    const className = combineClasses(
      styles.enhancementWithOverlay,
      isSet && i === active && styles.activeSet
    );

    return (
      <div key={i} className={className} onClick={cb.bind(this, enhancement)}>
        {!enhancement.isAttuned && (
          <img src={overlay} alt="enhancement overlay" />
        )}
        <img src={enhancement.image} alt="enhancement" />
      </div>
    );
  });
}

function renderSet(overlay, enhancements) {
  return enhancements.map((e, i) => {
    console.log("E: ", e);
    const text = shortenEnhName(e.displayName);
    return (
      <div key={text} className={styles.setEnhancement}>
        <div className={styles.enhancementWithOverlay}>
          <img src={overlay} alt="Enhancement overlay" />
          <img src={e.image} alt="Enhancement" />
        </div>
        <div className={styles.statPill}>{getPillText(text)}</div>
      </div>
    );
  });
}

function getPillText(text) {
  return text.split("/").map((stat, j, splitArr) => {
    const isLast = j === splitArr.length - 1;
    if (stat[0] === "*") {
      console.log("PROC?: ", stat);
      stat = "Proc";
    }

    return (
      <div key={stat + j}>
        <p
          className={combineClasses(
            styles[stat.toLowerCase()],
            j === 0 && styles.left,
            isLast && styles.right
          )}
        >
          {stat}
        </p>
        {!isLast && <div className={styles.pillDivider} />}
      </div>
    );
  });
}
