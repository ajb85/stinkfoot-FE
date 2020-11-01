import React from "react";

import HoverMenu from "../HoverMenus/Standards.js";

import { useGetEnhancementSubSections } from "hooks/enhancements.js";
import { getEnhancementOverlay } from "helpers/getImages.js";
import usePowerSlots from "providers/builder/usePowerSlots.js";
import useEnhNavigation from "providers/builder/useEnhancementNavigation.js";

import styles from "../styles.module.scss";

export default function StandardEnhancements(props) {
  const { powerSlotIndex, power: p } = props;
  const { enhNavigation } = useEnhNavigation();
  const getEnhancementSubSections = useGetEnhancementSubSections();
  const { addEnhancement } = usePowerSlots();
  const overlayImg = getEnhancementOverlay(enhNavigation.tier);

  return (
    <div className={styles.enhPreviewContainer}>
      <div className={styles.enhPreviewList}>
        {getEnhancementSubSections(p, enhNavigation).map((enh, i) => (
          <div className={styles.enhPreview} key={`${enh.fullName} @ ${i}`}>
            <div
              className={styles.enhancementImage}
              onClick={addEnhancement.bind(this, powerSlotIndex, enh)}
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
