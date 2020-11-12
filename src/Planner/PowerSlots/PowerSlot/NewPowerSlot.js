import React from "react";

import PunnettSquare from "components/PunnettSquare/";
import SlideDropdown from "components/SlideDropdown/";
import EnhancementSelection from "../EnhancementSelection.js";

import useEnhNavigation from "providers/builder/useEnhancementNavigation.js";
import { useGetEnhancementSubSections } from "hooks/enhancements.js";
import useActiveSets from "providers/builder/useActiveSets.js";
import { useTogglePowerSlot } from "hooks/powersets.js";
import EnhancementBar from "components/EnhancementBar/";

// import { getEnhancementImageWithOverlay } from "helpers/getImages.js";
import styles from "../styles.module.scss";

function PowerSlot({ slot, zIndex }) {
  const { level, power, powerSlotIndex } = slot;
  const enhNav = useEnhNavigation();
  const togglePowerSlot = useTogglePowerSlot(powerSlotIndex);
  const { tracking } = useActiveSets();
  const getEnhancementSubSections = useGetEnhancementSubSections();

  if (!power) {
    const isActive = tracking.activeLevel === level;
    return <EmptyPowerSlot level={level} isActive={isActive} />;
  }

  const isToggled = tracking.toggledSlot === powerSlotIndex;
  const subsections = getEnhancementSubSections(power.setTypes);

  return (
    <div
      className={styles.powerContainer}
      key={powerSlotIndex}
      onClick={togglePowerSlot}
      style={{ zIndex: zIndex + 1 }}
    >
      <div className={styles.pill} style={{ zIndex: zIndex + 1 }}>
        <p className="pillText">
          ({level}) {power.displayName}
        </p>
      </div>
      <EnhancementBar powerSlotIndex={powerSlotIndex} zIndex={zIndex + 2} />
      <SlideDropdown isToggled={isToggled} zIndex={zIndex}>
        <div className={styles.divider} />
        <PunnettSquare
          topOptions={getTopOptions(enhNav, power)}
          sideOptions={getSideOptions(enhNav, subsections)}
        >
          <EnhancementSelection powerSlotIndex={powerSlotIndex} />
        </PunnettSquare>
      </SlideDropdown>
    </div>
  );
}

function getTopOptions(enhNav, power) {
  const { enhNavigation, viewStandardEnhancements, viewIOSets } = enhNav;
  return [
    {
      content: "Standard",
      styles: {
        color: enhNavigation.section === "standard" ? "red" : null,
      },
      onClick: viewStandardEnhancements.bind(this, "IO"),
    },
    {
      content: "Sets",
      styles: { color: enhNavigation.section === "sets" ? "red" : null },
      onClick: viewIOSets.bind(this, power.setTypes[0]),
    },
  ];
}

function getSideOptions(enhNav, subsections) {
  const { enhNavigation, viewEnhancementSubSection } = enhNav;
  const { section } = enhNavigation;
  const isSet = section === "sets";

  return subsections.map((category) => {
    const name = isSet ? category.name : category;
    const setType = isSet ? category.setType : name;
    const isActive = isSet
      ? setType === enhNavigation.setType
      : name === enhNavigation.tier;
    return {
      content: name,
      onClick: viewEnhancementSubSection.bind(this, setType),
      style: {
        color: isActive ? "red" : "white",
        cursor: "pointer",
      },
    };
  });
}

function EmptyPowerSlot({ isActive, level }) {
  const { setTrackingManually } = useActiveSets();
  return (
    <div className={styles.powerContainer}>
      <div
        className={styles.power}
        onClick={setTrackingManually.bind(this, "activeLevel", level)}
        style={{ backgroundColor: isActive ? "green" : "grey" }}
      >
        <p>({level})</p>
      </div>
    </div>
  );
}

export default PowerSlot;
