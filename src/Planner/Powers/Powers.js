import React, { Fragment } from 'react';

import styles from './styles.module.scss';

function Powers({ build, setActiveLevel, addSlot, removeSlot }) {
  let index = 0;
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
            const { level, name, enhSlots, originalIndex } = powerSlot;
            // const isActive = build.activeLevel === level;
            const isEmpty = !powerSlot.name;

            return (
              <Fragment key={originalIndex}>
                {isEmpty ? (
                  <EmptyPowerSlot
                    setActiveLevel={setActiveLevel}
                    level={powerSlot.level}
                    isActive={build.activeLevel === powerSlot.level}
                  />
                ) : (
                  <div
                    className={styles.power}
                    style={{
                      backgroundColor: '#1b4ea8',
                    }}
                  >
                    <p onClick={addSlot.bind(this, originalIndex)}>
                      ({level}) {name}
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

function EmptyPowerSlot({ level, isActive, setActiveLevel }) {
  return (
    <div
      className={styles.power}
      onClick={setActiveLevel.bind(this, level)}
      style={{ backgroundColor: isActive ? 'green' : 'grey' }}
    >
      <p>({level})</p>
    </div>
  );
}

export default Powers;
