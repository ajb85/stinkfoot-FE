import React from 'react';

import powersets from 'data/powersets.js';

function Powersets({ build, updateBuild, togglePower }) {
  const { primary, secondary, archetype } = build;
  const { primaries, secondaries } = powersets[archetype];

  const renderPowerset = (set, isPrimary) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {set.powers
          .filter(({ isEpic }) => !isEpic)
          .map((p) => {
            const isUsedPower = build.powerLookup.hasOwnProperty(p.displayName);
            return (
              <p
                key={p.displayName}
                style={{
                  color: isUsedPower
                    ? 'lightgreen'
                    : build.activeLevel >= p.level
                    ? 'yellow'
                    : 'grey',
                }}
                onClick={togglePower.bind(this, p, isPrimary)}
              >
                {p.displayName}
              </p>
            );
          })}
      </div>
    );
  };
  return (
    <>
      <div>
        <label>Primary Power Set</label>
        <select
          value={primary.displayName}
          name="primary"
          onChange={(e) => updateBuild(e)}
        >
          {primaries.map((p) => (
            <option key={p.displayName} value={p.displayName}>
              {p.displayName}
            </option>
          ))}
        </select>
        <label>Secondary Power Set</label>
        <select
          value={secondary.displayName}
          name="secondary"
          onChange={(e) => updateBuild(e)}
        >
          {secondaries.map((p) => (
            <option key={p.displayName} value={p.displayName}>
              {p.displayName}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex' }}>
        {renderPowerset(
          primaries.find(
            ({ displayName }) => displayName === primary.displayName
          ),
          true
        )}
        {renderPowerset(
          secondaries.find(
            ({ displayName }) => displayName === secondary.displayName
          )
        )}
      </div>
    </>
  );
}

export default Powersets;
