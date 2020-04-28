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
              style={{ color: getPowerColor(stateManager, p) }}
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

function getPowerColor(stateManager, p) {
  const { build } = stateManager;
  const isPoolPower = p.archetypeOrder === 'poolPower' || !p.archetypeOrder;
  const isUsedPower = build.powerLookup.hasOwnProperty(p.fullName);
  const areReqsMet = arePowerRequirementsMet(stateManager, p);
  if (p.displayName === 'Misdirection') {
    console.log('MISDIRECTION: ', isPoolPower, isUsedPower, areReqsMet);
  }
  return isUsedPower
    ? areReqsMet
      ? 'lightgreen'
      : 'red'
    : stateManager.activeLevel >= p.level
    ? isPoolPower
      ? areReqsMet
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
