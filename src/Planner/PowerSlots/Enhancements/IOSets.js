import React, { useEffect, useRef } from "react";

import HoverMenu from "../HoverMenus/IOSets.js";

import usePlannerState from "hooks/usePlannerState.js";
import useEnhNavigation from "hooks/useEnhancementNavigation.js";

import styles from "../styles.module.scss";

export default function IOSets(props) {
  const enhRefs = useRef([]);
  const { powerSlotIndex, power: p } = props;
  const { enhNavigation, updateEnhNavigation } = useEnhNavigation();
  const stateManager = usePlannerState();
  const { getEnhancementSectionForPower } = stateManager;

  const enhancementsData = getEnhancementSectionForPower(p, enhNavigation);
  const overlayImg = stateManager.getEnhancementOverlay("IO");

  useEffect(() => {
    if (enhancementsData.length !== enhRefs.current.length) {
      enhRefs.current = enhRefs.current.slice(0, enhancementsData.length);
    }
  }, [enhancementsData.length, enhRefs]);

  const handleClick = updateNavigation(
    [enhNavigation, updateEnhNavigation],
    enhRefs
  );

  return (
    <div className={styles.enhPreviewContainer}>
      <div className={styles.enhPreviewList}>
        {enhancementsData.map((enh, i) => (
          <div className={styles.enhPreview} key={`${enh.fullName} @ ${i}`}>
            <div className={styles.enhancementImage}>
              {!enh.isAttuned && <img src={overlayImg} alt={enh.fullName} />}
              <img
                ref={(ele) => (enhRefs.current[i] = ele)}
                src={enh.image}
                alt={enh.fullName}
                onClick={handleClick.bind(this, i)}
              />
              <HoverMenu
                powerSlotIndex={powerSlotIndex}
                enhNavigation={enhNavigation}
                set={enh}
                display={
                  enhNavigation.ioSetIndex !== null
                    ? i === enhNavigation.ioSetIndex
                      ? "initial"
                      : "none"
                    : null
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const updateNavigation = (navState, enhRefs) => (i) => {
  const [enhNavigation, updateEnhNavigation] = navState;
  const ioSetIndex = i === enhNavigation.ioSetIndex ? null : i;
  updateEnhNavigation({ ioSetIndex });
};
