import React, { Fragment } from 'react';

import styles from './styles.module.scss';

function PowerSlots({ stateManager }) {
  const {
    build,
    setActiveLevelIndex,
    togglePowerSlot,
    addSlot,
    removeSlot,
    getPower,
  } = stateManager;
  let index = 0;

  const handlePillClick = (e, psIndex) => {
    const { className } = e.target;
    if (className === 'pillText' || build.powerSlotIndex !== psIndex) {
      togglePowerSlot(psIndex);
    }
  };

  const { selected /*, defaults*/ } = build.powerSlots.reduce(
    (acc, cur, originalIndex) => {
      const withIndex = { ...cur, originalIndex };
      if (cur.type === 'default') {
        acc.defaults.push(withIndex);
      } else {
        if (!acc.selected[index]) {
          acc.selected.push([]);
        }

        acc.selected[index].push(withIndex);

        if (acc.selected[index].length >= 8) {
          index++;
        }
      }
      return acc;
    },
    { selected: [], defaults: [] }
  );

  return (
    <div className={styles.Powers}>
      {selected.map((column, columnNumber) => (
        <div key={columnNumber} className={styles.column}>
          {column.map((powerSlot) => {
            const { level, power, enhSlots, originalIndex } = powerSlot;
            const isActive = stateManager.activeLevel === level;
            const isEmpty = !powerSlot.power;
            const isToggled = build.powerSlotIndex === originalIndex;

            const p = power ? getPower(power) : {};
            return (
              <Fragment key={originalIndex}>
                {isEmpty ? (
                  <EmptyPowerSlot
                    setActiveLevelIndex={setActiveLevelIndex}
                    index={originalIndex}
                    isActive={isActive}
                    level={powerSlot.level}
                  />
                ) : (
                  <div
                    className={styles.powerContainer}
                    onClick={(e) => handlePillClick(e, originalIndex)}
                    name="Pill"
                  >
                    <div
                      className={`${styles.power} ${
                        isToggled && styles.toggled
                      }`}
                      style={{
                        backgroundColor: '#1b4ea8',
                        zIndex: build.powerSlots.length - originalIndex,
                      }}
                    >
                      <p className="pillText">
                        ({level}) {p.displayName}{' '}
                      </p>
                      {
                        <div className={styles.enhancementsContainer}>
                          {enhSlots.map(({ slotLevel, setName, name }, j) => {
                            const displayLevel =
                              slotLevel === null ? level : slotLevel;
                            return (
                              <div
                                key={`${originalIndex} ${j}`}
                                onClick={removeSlot.bind(
                                  this,
                                  originalIndex,
                                  j
                                )}
                                className={styles.enhancementBubble}
                              >
                                <p>{displayLevel}</p>
                              </div>
                            );
                          })}
                        </div>
                      }
                      {isToggled && (
                        <p onClick={addSlot.bind(this, originalIndex)}>+</p>
                      )}
                    </div>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function EmptyPowerSlot({ index, level, isActive, setActiveLevelIndex }) {
  return (
    <div className={styles.powerContainer}>
      <div
        className={styles.power}
        onClick={setActiveLevelIndex.bind(this, index)}
        style={{ backgroundColor: isActive ? 'green' : 'grey' }}
      >
        <p>({level})</p>
      </div>
    </div>
  );
}

export default PowerSlots;
