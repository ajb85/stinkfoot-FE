import React, { useEffect, useRef } from "react";

import IOHoverMenu from "../HoverMenus/IOSets.js";

import { useGetEnhancementsForPower } from "hooks/enhancements.js";
import useEnhNavigation from "providers/builder/useEnhancementNavigation.js";
import useCharacterDetails from "providers/builder/useCharacterDetails.js";
import { getEnhancementOverlay } from "helpers/getImages.js";
import styles from "../styles.module.scss";

export default function IOSets(props) {
  const enhRefs = useRef([]);
  const { powerSlotIndex, power } = props;

  const { character } = useCharacterDetails();
  const { enhNavigation, updateEnhNavigation } = useEnhNavigation();
  const getEnhancementsForPower = useGetEnhancementsForPower();

  const enhancementsData = getEnhancementsForPower(power);
  const overlayImg = getEnhancementOverlay(character.origin, "IO");
  console.log("ENH FOR POWER: ", powerSlotIndex, power, enhancementsData);
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
              <IOHoverMenu
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
