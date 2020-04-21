import React from 'react';

function Powers({ build }) {
  return (
    <div>
      {build.powers.map((p, i) => {
        const { level, name /*, slots, type*/ } = p;
        const isActive = build.activeLevel === level;
        return (
          <div
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
