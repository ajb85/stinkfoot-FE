import React from 'react';

import powersets from 'data/powersets.js';

function Powersets({ build, updateBuild }) {
  const { primary, secondary, archetype } = build;
  const { primaries, secondaries } = powersets[archetype];

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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {primaries
            .find(({ displayName }) => displayName === primary.displayName)
            .powers.map(({ displayName }) => (
              <p>{displayName}</p>
            ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {secondaries
            .find(({ displayName }) => displayName === secondary.displayName)
            .powers.map(({ displayName }) => (
              <p>{displayName}</p>
            ))}
        </div>
      </div>
    </>
  );
}

export default Powersets;
