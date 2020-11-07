import React from "react";

// import StandardEnhancements from "../Enhancements/Standards.js";
// import IOSetEnhancements from "../Enhancements/IOSets.js";
// import { getPowerStats } from "../../../js/powerCalculations.js";
// import TableList from "components/TableList/";
import PunnettSquare from "components/PunnettSquare/";
import SlideDropdown from "components/SlideDropdown/";

import useEnhNavigation from "providers/builder/useEnhancementNavigation.js";
// import useCharacterDetails from "providers/builder/useCharacterDetails.js";
import { useGetEnhancementSubSections } from "hooks/enhancements.js";
import useActiveSets from "providers/builder/useActiveSets.js";
// import usePowerSlots from "providers/builder/usePowerSlots.js";
import { useTogglePowerSlot } from "hooks/powersets.js";

// import { getEnhancementImageWithOverlay } from "helpers/getImages.js";
import styles from "../styles.module.scss";

function PowerSlot({ slot }) {
  const { level, power, powerSlotIndex } = slot;
  const enhNav = useEnhNavigation();
  const togglePowerSlot = useTogglePowerSlot(powerSlotIndex);
  const { tracking } = useActiveSets();
  // const { powerSlots } = usePowerSlots();
  const getEnhancementSubSections = useGetEnhancementSubSections();
  const isToggled = tracking.toggledSlot === powerSlotIndex;

  if (!power) {
    const isActive = tracking.activeLevel === level;
    return <EmptyPowerSlot level={level} isActive={isActive} />;
  }

  const subsections = getEnhancementSubSections(power.setTypes);

  return (
    <div
      className={styles.powerContainer}
      key={powerSlotIndex}
      onClick={togglePowerSlot}
    >
      <div className={`${styles.pill} ${isToggled && styles.toggled}`}>
        <p className="pillText">
          ({level}) {power.displayName}
        </p>
      </div>
      {powerSlotIndex === 0 && (
        <SlideDropdown isToggled={isToggled}>
          <PunnettSquare
            topOptions={getTopOptions(enhNav, power)}
            sideOptions={getSideOptions(enhNav, subsections)}
          ></PunnettSquare>
        </SlideDropdown>
      )}
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
      onClick: viewStandardEnhancements,
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
