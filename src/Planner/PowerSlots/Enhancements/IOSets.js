import React, { useEffect, useRef } from "react";

import { usePlannerState } from "Providers/PlannerStateManagement.js";
import HoverMenu from "../HoverMenus/IOSets.js";

import styles from "../styles.module.scss";

export default function IOSets(props) {
  const enhRefs = useRef([]);
  const { selectionState, powerSlotIndex, power: p } = props;
  const [enhNavigation] = selectionState;
  const stateManager = usePlannerState();
  const { getEnhancementSectionForPower } = stateManager;

  const enhancementsData = getEnhancementSectionForPower(p, enhNavigation);
  const overlayImg = stateManager.getEnhancementOverlay("IO");

  useEffect(() => {
    if (enhancementsData.length !== enhRefs.current.length) {
      enhRefs.current = enhRefs.current.slice(0, enhancementsData.length);
    }
  }, [enhancementsData.length, enhRefs]);

  const handleClick = updateNavigation(selectionState, enhRefs);

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

const updateNavigation = ([enhNavigation, setEnhNavigation], enhRefs) => (
  i
) => {
  const ioSetIndex = i === enhNavigation.ioSetIndex ? null : i;
  setEnhNavigation({ ...enhNavigation, ioSetIndex });
};
