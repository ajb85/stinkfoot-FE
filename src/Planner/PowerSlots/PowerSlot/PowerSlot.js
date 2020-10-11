import React, { useCallback } from "react";

import usePlannerState from "hooks/usePlannerState.js";
import StandardEnhancements from "../Enhancements/Standards.js";
import IOSetEnhancements from "../Enhancements/IOSets.js";
import { getPowerStats } from "../../../js/powerCalculations.js";

import TableList from "components/TableList/";
import PunnettSquare from "components/PunnettSquare/";

import useEnhNavigation from "hooks/useEnhancementNavigation.js";
import styles from "../styles.module.scss";

function PowerSlot({ slot }) {
  const stateManager = usePlannerState();
  const { getPower, getState } = stateManager;
  const { level, power, powerSlotIndex } = slot;
  const { enhNavigation, updateEnhNavigation } = useEnhNavigation();
  const isToggled = stateManager.toggledPowerSlotIndex === powerSlotIndex;
  const p = power ? getPower(power) : {};
  const zIndex =
    stateManager.getFromState("powerSlots").length * 2 - powerSlotIndex * 2;
  const { togglePowerSlot } = stateManager;
  const handlePowerToggle = useCallback(() => togglePowerSlot(powerSlotIndex), [
    togglePowerSlot,
    powerSlotIndex,
  ]);

  if (!power) {
    // Empty PowerSlot
    const isActive = stateManager.activeLevel === level;
    return (
      <div className={styles.powerContainer}>
        <div
          className={styles.power}
          onClick={(e) => {
            e.target.name = "activeLevelIndex";
            e.target.value = powerSlotIndex;
            stateManager.updateTracking(e);
          }}
          style={{ backgroundColor: isActive ? "green" : "grey" }}
        >
          <p>({level})</p>
        </div>
      </div>
    );
  }

  const powerStats = getPowerStats(getState())(powerSlotIndex);

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
        tier: p.setTypes[0],
        ioSetIndex: null,
      }),
    },
  ];

  const sideOptions = stateManager
    .getSubSectionsForPower(enhNavigation, p.setTypes)
    .map(({ tier, name }) => ({
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
    }));

  return (
    <div
      className={styles.powerContainer}
      onClick={!isToggled ? handlePowerToggle : noFunc}
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
        <p className="pillText" onClick={handlePowerToggle}>
          ({level}) {p.displayName}
        </p>

        <PunnettSquare
          topOptions={topOptions}
          sideOptions={sideOptions}
          slot={slot}
        >
          {enhNavigation.section === "standard" ? (
            <StandardEnhancements powerSlotIndex={powerSlotIndex} power={p} />
          ) : (
            <IOSetEnhancements powerSlotIndex={powerSlotIndex} power={p} />
          )}
        </PunnettSquare>
        {/* Power stats - temporarily disabled, not ready for this feature */}
        {false && <TableList list={powerStats} />}
      </div>
      {/* Selected Enhancements Menu */}
      <HoverMenu slot={slot} />
    </div>
  );
}

export default PowerSlot;

function noFunc() {}
function HoverMenu({ slot }) {
  const stateManager = usePlannerState();
  const { getPower } = stateManager;
  const { level, power, enhSlots, powerSlotIndex } = slot;

  const p = power ? getPower(power) : {};
  const zIndex =
    stateManager.getFromState("powerSlots").length * 2 - powerSlotIndex * 2;
  const { removeSlots } = stateManager;

  return (
    <div
      style={{ zIndex: zIndex + 1 }}
      className={styles.enhancementsContainer}
    >
      {enhSlots.map(({ slotLevel, enhancement }, j) => {
        const displayLevel = slotLevel === null ? level : slotLevel;

        const images = enhancement
          ? stateManager.getEnhancementAndOverlayImages(enhancement)
          : null;

        return (
          <React.Fragment key={`${slotLevel} @ ${j}`}>
            {images ? (
              <div
                className={styles.enhancementSlot}
                onClick={removeSlots.bind(this, powerSlotIndex, j)}
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
                  onClick={removeSlots.bind(this, powerSlotIndex, j)}
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
