import React from 'react';

import powersets from 'data/powersets.js';
import poolPowers from 'data/poolPowers.js';

import arePowerRequirementsMet from 'js/arePowerRequirementsMet.js';

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
        ? poolPowers.find(({ fullName }) => fullName === header)
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
    const isPoolPower = powerType === 'poolPower';
    return (
      <div className={styles.powersList}>
        {set.powers
          .filter(({ isEpic }) => isPoolPower || !isEpic)
          .map((p) => {
            const isUsedPower = build.powerLookup.hasOwnProperty(p.fullName);
            return (
              <p
                key={p.fullName}
                style={{
                  color: isUsedPower
                    ? 'lightgreen'
                    : build.activeLevel >= p.level
                    ? isPoolPower
                      ? arePowerRequirementsMet(build, p)
                        ? 'yellow'
                        : 'grey'
                      : 'yellow'
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
      {header && (
        <h3>{order === 'poolPower' ? header.split('.')[1] : header}</h3>
      )}
      {renderSelect && (
        <select
          value={powerSection.active.displayName}
          name={order}
          onChange={(e) => updateBuild(e)}
        >
          {powerSection.powersets
            .filter(
              ({ fullName }) =>
                !build.excludedPowersets[fullName] &&
                !build.poolPowers.find((name) => fullName === name)
            )
            .map((p) => (
              <option key={p.fullName} value={p.displayName}>
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
