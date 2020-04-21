import React, { Fragment } from 'react';

function Powers({ build, setActiveLevel, addSlot, removeSlot }) {
  return (
    <div>
      {build.powerSlots.map((powerSlot, i) => {
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
                style={{
                  backgroundColor: isActive ? 'lightblack' : 'black',
                }}
              >
                <p onClick={addSlot.bind(this, i)}>
                  ({level}) {name}
                </p>
                <div>
                  {enhSlots.map(({ slotLevel, setName, name }, j) => {
                    const displayLevel = slotLevel === null ? level : slotLevel;
                    return (
                      <p onClick={removeSlot.bind(this, i, j)} key={j}>
                        {displayLevel}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

function EmptyPowerSlot({ level, isActive, setActiveLevel }) {
  return (
    <div
      onClick={setActiveLevel.bind(this, level)}
      style={{ backgroundColor: isActive ? 'green' : 'darkblue' }}
    >
      <p>({level})</p>
    </div>
  );
}

export default Powers;
