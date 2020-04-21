import React from 'react';

function Powers({ build, setActiveLevel }) {
  return (
    <div>
      {build.powers.map((p, i) => {
        const { level, name /*, slots, type*/ } = p;
        const isActive = build.activeLevel === level;
        const isEmpty = !name;
        return (
          <div
            onClick={() => {
              if (isEmpty) {
                setActiveLevel(level);
              }
            }}
            style={{
              backgroundColor: name
                ? isActive
                  ? 'lightblack'
                  : 'black'
                : isActive
                ? 'green'
                : 'darkblue',
            }}
            key={i}
          >
            ({level}) {name}
          </div>
        );
      })}
    </div>
  );
}

export default Powers;
