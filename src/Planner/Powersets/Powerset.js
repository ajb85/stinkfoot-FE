import React from 'react';

import arePowerRequirementsMet from 'js/arePowerRequirementsMet.js';

import styles from './styles.module.scss';

function Powerset(props) {
  const { header, dropdown, powerList, stateManager } = props;
  const { updateBuild, build } = stateManager;

  // This allows components to supply their own method to run
  // when a power is clicked
  const togglePower = props.togglePower || stateManager.togglePower;

  const renderDropdown = () => {
    const { list, name } = dropdown;
    const index = build[name];
    return (
      <select value={index} name={name} onChange={(e) => updateBuild(e)}>
        {filterDropdownList(stateManager, list).map((p, i) => (
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
        {powerList.map((p) => {
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
  const isPoolPower = p.archetypeOrder === 'poolPower';
  const isUsedPower = build.powerLookup.hasOwnProperty(p.fullName);
  const areReqsMet = arePowerRequirementsMet(stateManager, p);

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

function filterDropdownList(stateManager, list) {
  const {
    build: { excludedPowersets },
    selectedPoolLookup,
  } = stateManager;

  return list.filter(
    ({ fullName }) =>
      !excludedPowersets[fullName] && !selectedPoolLookup[fullName]
  );
}

export default Powerset;
