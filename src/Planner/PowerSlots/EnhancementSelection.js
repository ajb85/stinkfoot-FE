import React from "react";

import usePowerSlots from "providers/builder/usePowerSlots";
import {
  useGetEnhancementsForPower,
  useGetEnhancementOverlay,
} from "hooks/enhancements";
import useEnhNavigation from "providers/builder/useEnhancementNavigation.js";

import styles from "./styles.module.scss";

function EnhancementSelection(props) {
  const { powerSlots } = usePowerSlots();
  const { power } = powerSlots[props.powerSlotIndex];
  const enhancements = useGetEnhancementsForPower()(power);
  const getOverlay = useGetEnhancementOverlay();
  const { enhNavigation } = useEnhNavigation();
  const { tier } = enhNavigation;

  return (
    <div className={styles.enhancementPreview}>
      {enhancements.map((e) => (
        <div key={e.fullName}>
          <img src={getOverlay(tier)} alt="enhancement overlay" />
          <img src={e.image} alt="enhancement" />
        </div>
      ))}
    </div>
  );
}

export default EnhancementSelection;
