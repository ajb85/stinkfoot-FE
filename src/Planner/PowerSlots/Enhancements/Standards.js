import React from "react";

import HoverMenu from "../HoverMenus/Standards.js";

import { useGetEnhancementsForPower } from "hooks/enhancements.js";
import { getEnhancementOverlay } from "helpers/getImages.js";
import { useAddEnhancement } from "hooks/enhancements.js";
import useEnhNavigation from "providers/builder/useEnhancementNavigation.js";
import useCharacterDetails from "providers/builder/useCharacterDetails.js";

import styles from "../styles.module.scss";

export default function StandardEnhancements(props) {
  const { powerSlotIndex, power: p } = props;
  const { enhNavigation } = useEnhNavigation();
  const getEnhancementsForPower = useGetEnhancementsForPower();
  const addEnhancement = useAddEnhancement(powerSlotIndex);
  const { character } = useCharacterDetails();
  const overlayImg = getEnhancementOverlay(
    character.origin,
    enhNavigation.tier
  );

  return (
    <div className={styles.enhPreviewContainer}>
      <div className={styles.enhPreviewList}>
        {getEnhancementsForPower(p).map((enh, i) => (
          <div className={styles.enhPreview} key={`${enh.fullName} @ ${i}`}>
            <div
              className={styles.enhancementImage}
              onClick={addEnhancement.bind(this, enh)}
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
