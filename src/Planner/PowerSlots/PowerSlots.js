import React, { Fragment } from 'react';

import { PlannerContext } from 'Providers/PlannerStateManagement.js';

import styles from './styles.module.scss';

function PowerSlots(props) {
  const stateManager = React.useContext(PlannerContext);
  const {
    updateTracking,
    togglePowerSlot,
    addSlot,
    removeSlot,
    getPower,
  } = stateManager;
  let index = 0;

  const handlePillClick = (e, psIndex) => {
    const { className } = e.target;
    console.log('CLASS NAME: ', className);
    if (
      className === 'pillText' ||
      stateManager.toggledPowerSlotIndex !== psIndex
    ) {
      togglePowerSlot(psIndex);
    }
  };

  const { selected /*, defaults*/ } = stateManager
    .getFromState('powerSlots')
    .reduce(
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
            const isToggled =
              stateManager.toggledPowerSlotIndex === originalIndex;
            const p = power ? getPower(power) : {};

            return (
              <Fragment key={originalIndex}>
                {isEmpty ? (
                  <EmptyPowerSlot
                    updateTracking={updateTracking}
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
                        zIndex:
                          stateManager.getFromState('powerSlots').length -
                          originalIndex,
                      }}
                    >
                      <p className="pillText">
                        ({level}) {p.displayName}
                      </p>

                      <div className={styles.enhancementsContainer}>
                        {enhSlots.map(({ slotLevel, setName, name }, j) => {
                          const displayLevel =
                            slotLevel === null ? level : slotLevel;
                          return (
                            <div
                              key={`${originalIndex} ${j}`}
                              onClick={removeSlot.bind(this, originalIndex, j)}
                              className={styles.enhancementBubble}
                            >
                              <p>{displayLevel}</p>
                            </div>
                          );
                        })}
                      </div>

                      {isToggled && (
                        <div className={styles.addEnhancements}>
                          <p onClick={addSlot.bind(this, originalIndex)}>+</p>
                          <div className={styles.enhancementList}>
                            {stateManager
                              .getEnhancementsForPowerByType(p, 'IO')
                              .map(
                                ({ image: { enhancement, overlay }, name }) => (
                                  <div
                                    key={name}
                                    className={styles.enhancementImage}
                                  >
                                    <img src={overlay} alt={name} />
                                    <img src={enhancement} alt={name} />
                                  </div>
                                )
                              )}
                          </div>
                        </div>
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

function EmptyPowerSlot({ index, level, isActive, updateTracking }) {
  return (
    <div className={styles.powerContainer}>
      <div
        className={styles.power}
        onClick={(e) => {
          e.target.name = 'activeLevelIndex';
          e.target.value = index;
          updateTracking.bind(this, e);
        }}
        style={{ backgroundColor: isActive ? 'green' : 'grey' }}
      >
        <p>({level})</p>
      </div>
    </div>
  );
}

export default PowerSlots;
