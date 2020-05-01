import React from 'react';

import arePowerRequirementsMet from 'js/arePowerRequirementsMet.js';
import Dropdown from 'Planner/UI/Dropdown/';

import styles from './styles.module.scss';

function Powerset(props) {
  const { header, dropdown, powerList, stateManager, poolIndex } = props;
  const { updateBuild, build } = stateManager;

  const isPoolPower = !isNaN(parseInt(poolIndex, 10));
  // This allows components to supply their own method to run
  // when a power is clicked
  const togglePower = props.togglePower || stateManager.togglePower;

  const images = require.context('Planner/images/powersets', true);

  const renderDropdown = () => {
    const { list, name } = dropdown;
    const index = build[name];
    return (
      <Dropdown
        selected={index}
        name={name}
        width={150 + 20}
        options={filterDropdownList(stateManager, list).map((p) => ({
          value: p.originalIndex,
          display: p.displayName,
          image: images(`./${p.imageName}`),
        }))}
        onChange={(e) => updateBuild(e)}
      />
    );
  };

  return (
    <div className={styles.Powerset}>
      {header ? (
        isPoolPower ? (
          <h3 onClick={stateManager.removePool.bind(this, poolIndex)}>
            {header}
          </h3>
        ) : (
          <h3>{header}</h3>
        )
      ) : null}
      {dropdown && renderDropdown()}
      <div className={styles.powersList}>
        {powerList.map((p) => {
          return (
            <p
              key={p.fullName}
              style={{ color: getPowerColor(stateManager, p) }}
              onClick={togglePower.bind(this, p, poolIndex)}
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
  const isPoolPower =
    p.archetypeOrder === 'poolPower' || p.archetypeOrder === 'epicPool';
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

  return list
    .map((l, i) => {
      l.originalIndex = i;
      return l;
    })
    .filter(
      ({ fullName }) =>
        !excludedPowersets[fullName] && !selectedPoolLookup[fullName]
    );
}

export default Powerset;
