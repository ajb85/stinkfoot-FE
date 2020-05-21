import React from 'react';

import { usePlannerState } from 'Providers/PlannerStateManagement.js';
import StandardEnhancements from '../Enhancements/Standards.js';
import IOSetEnhancements from '../Enhancements/IOSets.js';

import styles from '../styles.module.scss';

function PowerSlot({ slot, selectionState }) {
  const [enhNavigation, setEnhNavigation] = selectionState;
  const stateManager = usePlannerState();
  const { getPower } = stateManager;
  const { level, power, enhSlots, powerSlotIndex } = slot;

  const isToggled = stateManager.toggledPowerSlotIndex === powerSlotIndex;
  const p = power ? getPower(power) : {};
  const zIndex =
    stateManager.getFromState('powerSlots').length * 2 - powerSlotIndex * 2;
  const { togglePowerSlot, removeSlots } = stateManager;

  const handlePillClick = (e, psIndex) => {
    const { className } = e.target;
    if (
      className === 'pillText' ||
      stateManager.toggledPowerSlotIndex !== psIndex
    ) {
      togglePowerSlot(psIndex);
    }
  };

  if (!power) {
    // Empty PowerSlot
    const isActive = stateManager.activeLevel === level;

    return (
      <div className={styles.powerContainer}>
        <div
          className={styles.power}
          onClick={(e) => {
            e.target.name = 'activeLevelIndex';
            e.target.value = powerSlotIndex;
            stateManager.updateTracking(e);
          }}
          style={{ backgroundColor: isActive ? 'green' : 'grey' }}
        >
          <p>({level})</p>
        </div>
      </div>
    );
  }

  const enhancementComps = {
    standard: StandardEnhancements,
    sets: IOSetEnhancements,
  };

  const Enhancements = enhancementComps[enhNavigation.section];

  return (
    <div
      className={styles.powerContainer}
      onClick={(e) => handlePillClick(e, powerSlotIndex)}
      key={powerSlotIndex}
    >
      <div
        className={`${styles.power} ${isToggled && styles.toggled}`}
        style={{
          backgroundColor: '#1b4ea8',
          zIndex,
        }}
      >
        {/* Pill Title */}
        <p className="pillText">
          ({level}) {p.displayName}
        </p>

        {/* Select Enhancement Menu */}
        <div className={styles.selectEnhancements}>
          <div className={styles.EnhSectionSelect}>
            <p
              onClick={setEnhNavigation.bind(this, {
                ...enhNavigation,
                section: 'standard',
                tier: 'IO',
                ioSetIndex: null,
              })}
              style={{
                color: enhNavigation.section === 'standard' ? 'red' : null,
              }}
            >
              Standard
            </p>
            <p
              onClick={setEnhNavigation.bind(this, {
                ...enhNavigation,
                section: 'sets',
                tier: p.setTypes[0],
                ioSetIndex: null,
              })}
              style={{ color: enhNavigation.section === 'sets' ? 'red' : null }}
            >
              Sets
            </p>
          </div>
          <Enhancements
            selectionState={selectionState}
            powerSlotIndex={powerSlotIndex}
            power={p}
          />
        </div>
      </div>

      {/* Selected Enhancements Render */}
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
                    <img
                      src={images.enhancement}
                      alt={enhancement.displayName}
                    />
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
    </div>
  );
}

export default PowerSlot;
