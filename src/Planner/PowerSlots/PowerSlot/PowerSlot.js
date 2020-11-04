import React from "react";

import StandardEnhancements from "../Enhancements/Standards.js";
import IOSetEnhancements from "../Enhancements/IOSets.js";
// import { getPowerStats } from "../../../js/powerCalculations.js";
// import TableList from "components/TableList/";
import PunnettSquare from "components/PunnettSquare/";

import useEnhNavigation from "providers/builder/useEnhancementNavigation.js";
import useCharacterDetails from "providers/builder/useCharacterDetails.js";
import { useGetEnhancementSubSections } from "hooks/enhancements.js";
import useActiveSets from "providers/builder/useActiveSets.js";
import usePowerSlots from "providers/builder/usePowerSlots.js";
import { useTogglePowerSlot } from "hooks/powersets.js";

import { getEnhancementImageWithOverlay } from "helpers/getImages.js";
import styles from "../styles.module.scss";

function PowerSlot({ slot }) {
  const { level, power, powerSlotIndex } = slot;
  const { enhNavigation, updateEnhNavigation } = useEnhNavigation();
  const togglePowerSlot = useTogglePowerSlot(powerSlotIndex);
  const { tracking, setTrackingManually } = useActiveSets();
  const { powerSlots } = usePowerSlots();
  const getEnhancementSubSections = useGetEnhancementSubSections();
  const isToggled = tracking.toggledSlot === powerSlotIndex;
  const zIndex = powerSlots.length * 2 - powerSlotIndex * 2;

  if (!power) {
    // Empty PowerSlot
    const isActive = tracking.activeLevel === level;
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

  const topOptions = [
    {
      content: "Standard",
      styles: {
        color: enhNavigation.section === "standard" ? "red" : null,
      },
      onClick: updateEnhNavigation.bind(this, {
        section: "standard",
        tier: "IO",
        ioSetIndex: null,
      }),
    },
    {
      content: "Sets",
      styles: { color: enhNavigation.section === "sets" ? "red" : null },
      onClick: updateEnhNavigation.bind(this, {
        section: "sets",
        tier: power.setTypes[0],
        ioSetIndex: null,
      }),
    },
  ];

  const sideOptions = getEnhancementSubSections(power.setTypes).map(
    ({ tier, name }) => ({
      content: name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join(""),
      onClick: updateEnhNavigation.bind(this, {
        tier,
        ioSetIndex: null,
      }),
      style: {
        color: enhNavigation.tier === tier ? "red" : null,
        cursor: "pointer",
      },
    })
  );

  return (
    <div
      className={styles.powerContainer}
      onClick={!isToggled ? togglePowerSlot : noFunc}
      key={powerSlotIndex}
    >
      <div
        className={`${styles.power} ${isToggled && styles.toggled}`}
        style={{
          backgroundColor: "#1b4ea8",
          zIndex,
        }}
      >
        {/* Pill Title */}
        <p className="pillText" onClick={togglePowerSlot}>
          ({level}) {power.displayName}
        </p>

        <PunnettSquare
          topOptions={topOptions}
          sideOptions={sideOptions}
          slot={slot}
        >
          {enhNavigation.section === "standard" ? (
            <StandardEnhancements
              powerSlotIndex={powerSlotIndex}
              power={power}
            />
          ) : (
            <IOSetEnhancements powerSlotIndex={powerSlotIndex} power={power} />
          )}
        </PunnettSquare>
        {/* Power stats - temporarily disabled, not ready for this feature */}
        {/* {false && <TableList list={powerStats} />} */}
      </div>

      <FloatingSelectedEnhancements slot={slot} />
    </div>
  );
}

export default PowerSlot;

function noFunc() {}
function FloatingSelectedEnhancements({ slot }) {
  const {
    powerSlots,
    removePowerFromSlot,
    removeEnhancement,
  } = usePowerSlots();
  const { level, enhSlots, powerSlotIndex } = slot;
  const { character } = useCharacterDetails();
  const zIndex = powerSlots.length * 2 - powerSlotIndex * 2;

  return (
    <div
      style={{ zIndex: zIndex + 1 }}
      className={styles.enhancementsContainer}
    >
      {enhSlots.map(({ slotLevel, enhancement }, j) => {
        const displayLevel = slotLevel === null ? level : slotLevel;

        const images = enhancement
          ? getEnhancementImageWithOverlay(character.origin, enhancement)
          : null;

        return (
          <React.Fragment key={`${slotLevel} @ ${j}`}>
            {images ? (
              <div
                className={styles.enhancementSlot}
                onClick={removePowerFromSlot.bind(this, powerSlotIndex, j)}
              >
                <div
                  className={styles.enhancementImage}
                  style={{ left: 8, top: 0 }}
                >
                  {!!images.overlay && (
                    <img src={images.overlay} alt={enhancement.displayName} />
                  )}
                  <img src={images.enhancement} alt={enhancement.displayName} />
                  <p>{displayLevel}</p>
                </div>
              </div>
            ) : (
              <div className={styles.enhancementSlot}>
                <div
                  key={`${powerSlotIndex} ${j}`}
                  onClick={removeEnhancement.bind(this, powerSlotIndex, j)}
                  className={styles.enhancementBubble}
                >
                  <p>{displayLevel}</p>
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
