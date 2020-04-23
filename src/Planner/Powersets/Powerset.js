import React from 'react';

import powersets from 'data/powersets.js';
import poolPowers from 'data/poolPowers.js';

import styles from './styles.module.scss';

function Powerset(props) {
  const {
    header,
    order,
    build,
    updateBuild,
    renderSelect,
    togglePower,
  } = props;
  const { primary, secondary, poolPower, archetype } = build;
  const { primaries, secondaries } = powersets[archetype];
  const activePool =
    order === 'poolPower'
      ? header
        ? poolPowers.find(({ displayName }) => displayName === header)
        : poolPower
      : null;

  const powerSections = {
    primary: { name: 'primaries', powersets: primaries, active: primary },
    secondary: {
      name: 'secondaries',
      powersets: secondaries,
      active: secondary,
    },
    poolPower: {
      name: 'poolPowers',
      powersets: poolPowers,
      active: activePool,
    },
  };

  const powerSection = powerSections[order];

  const renderPowerset = (set, powerType) => {
    return (
      <div className={styles.powersList}>
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
                onClick={togglePower.bind(this, p, powerType)}
              >
                {p.displayName}
              </p>
            );
          })}
      </div>
    );
  };

  if (renderSelect && !updateBuild) {
    console.error('Render select provided without a way to update the build');
    return <div />;
  }
  return (
    <div className={styles.powerset}>
      {header && <h3>{header}</h3>}
      {renderSelect && (
        <select
          value={powerSection.active.displayName}
          name={order}
          onChange={(e) => updateBuild(e)}
        >
          {powerSection.powersets
            .filter(
              ({ displayName }) =>
                !build.excludedPowersets[displayName] &&
                !build.poolPowers.find((name) => displayName === name)
            )
            .map((p) => (
              <option key={p.displayName} value={p.displayName}>
                {p.displayName}
              </option>
            ))}
        </select>
      )}
      {renderPowerset(powerSection.active, order)}
    </div>
  );
}

export default Powerset;
