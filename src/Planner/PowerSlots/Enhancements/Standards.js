import React from "react";

import HoverMenu from "../HoverMenus/Standards.js";

import usePlannerState from "providers/usePlannerState.js";
import useEnhNavigation from "providers/builder/useEnhancementNavigation.js";

import styles from "../styles.module.scss";

export default function StandardEnhancements(props) {
  const { powerSlotIndex, power: p } = props;
  const { enhNavigation } = useEnhNavigation();
  const stateManager = usePlannerState();
  const overlayImg = stateManager.getEnhancementOverlay(enhNavigation.tier);

  return (
    <div className={styles.enhPreviewContainer}>
      <div className={styles.enhPreviewList}>
        {stateManager
          .getEnhancementSectionForPower(p, enhNavigation)
          .map((enh, i) => (
            <div className={styles.enhPreview} key={`${enh.fullName} @ ${i}`}>
              <div
                className={styles.enhancementImage}
                onClick={stateManager.addEnhancement.bind(
                  this,
                  powerSlotIndex,
                  enh,
                  enhNavigation,
                  50
                )}
              >
                <img src={overlayImg} alt={enh.fullName} />
                <img src={enh.image} alt={enh.fullName} />
                <HoverMenu enhancement={enh} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
