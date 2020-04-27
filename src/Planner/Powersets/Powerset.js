import React from 'react';

import arePowerRequirementsMet from 'js/arePowerRequirementsMet.js';

import styles from './styles.module.scss';

function Powerset(props) {
  const { header, dropdown, powerList, stateManager } = props;
  const { updateBuild, togglePower, build } = stateManager;
  const { list, name, value } = dropdown;

  return (
    <div className={styles.powerset}>
      {header && <h3>{header}</h3>}
      {list && (
        <select value={value} name={name} onChange={(e) => updateBuild(e)}>
          {list.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      )}
      <div className={styles.powersList}>
        {powerList.map((p) => {
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

export default Powerset;
