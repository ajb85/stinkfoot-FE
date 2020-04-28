import React from 'react';

import arePowerRequirementsMet from 'js/arePowerRequirementsMet.js';

import styles from './styles.module.scss';

function Powerset(props) {
  const { header, dropdown, powerList, stateManager } = props;
  const { updateBuild, togglePower, build } = stateManager;

  const renderDropdown = () => {
    const { list, name } = dropdown;
    const index = build[name];
    return (
      <select value={index} name={name} onChange={(e) => updateBuild(e)}>
        {list.map((p, i) => (
          <option key={p.fullName} value={i}>
            {p.displayName}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className={styles.powerset}>
      {header && <h3>{header}</h3>}
      {dropdown && renderDropdown()}
      <div className={styles.powersList}>
        {filterPowerList(build, powerList).map((p) => {
          return (
            <p
              key={p.fullName}
              style={{ color: getPowerColor(build, p) }}
              onClick={togglePower.bind(this, p)}
            >
              {p.displayName}
            </p>
          );
        })}
      </div>
    </div>
  );
}

function getPowerColor(build, p) {
  const isPoolPower = p.archetypeOrder === 'poolPower';
  const isUsedPower = build.powerLookup.hasOwnProperty(p.fullName);
  const areReqsMet = arePowerRequirementsMet(build, p);
  return isUsedPower
    ? areReqsMet
      ? 'lightgreen'
      : 'red'
    : build.activeLevel >= p.level
    ? isPoolPower
      ? arePowerRequirementsMet(build, p)
        ? 'yellow'
        : 'grey'
      : 'yellow'
    : 'grey';
}

function filterPowerList(build, powers) {
  return powers
    .map((p, i) => ({ ...p, originalIndex: i }))
    .filter(
      ({ fullName, archetypeOrder }) =>
        !build.poolPowers.find((name) => fullName === name)
    );
}

export default Powerset;
