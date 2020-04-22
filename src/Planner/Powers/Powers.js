import React, { Fragment } from 'react';

import styles from './styles.module.scss';

function Powers({ build, setActiveLevel, addSlot, removeSlot }) {
  let index = 0;
  const { selected, defaults } = build.powerSlots.reduce(
    (acc, cur) => {
      if (cur.type === 'default') {
        acc.defaults.push(cur);
      } else {
        if (!acc.selected[index]) {
          acc.selected.push([]);
        }

        acc.selected[index].push(cur);

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
      {selected.map((column) => (
        <div className={styles.column}>
          {column.map((powerSlot, i) => {
            const { level, name, enhSlots } = powerSlot;
            const isActive = build.activeLevel === level;
            const isEmpty = !powerSlot.name;

            return (
              <Fragment key={i}>
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
                    <p onClick={addSlot.bind(this, i)}>
                      ({level}) {name}
                    </p>
                    <div className={styles.enhancementsContainer}>
                      {enhSlots.map(({ slotLevel, setName, name }, j) => {
                        const displayLevel =
                          slotLevel === null ? level : slotLevel;
                        return (
                          <div
                            onClick={removeSlot.bind(this, i, j)}
                            className={styles.enhancementBubble}
                          >
                            <p key={j}>{displayLevel}</p>
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
