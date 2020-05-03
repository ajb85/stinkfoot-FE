import React from 'react';

import arePowerRequirementsMet from 'js/arePowerRequirementsMet.js';
import Dropdown from 'Planner/UI/Dropdown/';
import { PlannerContext } from 'Providers/PlannerStateManagement.js';

import styles from './styles.module.scss';

function Powerset(props) {
  const stateManager = React.useContext(PlannerContext);

  const { header, dropdown, powerList, poolIndex } = props;

  const isPoolPower = !isNaN(parseInt(poolIndex, 10));

  // This allows components to supply their own methods to run when
  // clicking a power or changing dropdown selection.
  const togglePower = props.togglePower || stateManager.togglePower;
  const updateBuild = props.updateBuild || stateManager.updateBuild;

  const renderDropdown = () => {
    const { list, name } = dropdown;
    const index = stateManager.getFromState(name);
    return (
      <Dropdown
        selected={index}
        name={name}
        width={150 + 20}
        options={filterDropdownList(stateManager, list).map((p) => ({
          value: p.originalIndex,
          display: p.displayName,
          image: stateManager.getPowersetImage(p.imageName),
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
  const { buildHasPower } = stateManager;
  const isPoolPower =
    p.archetypeOrder === 'poolPower' || p.archetypeOrder === 'epicPool';
  const isPowerInUse = buildHasPower(p.fullName);
  const areReqsMet = arePowerRequirementsMet(stateManager, p);

  if (p.displayName === 'Tough') {
    console.log('MET: ', p, isPowerInUse, areReqsMet);
  }

  return isPowerInUse
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
  const { poolCanBeAdded } = stateManager;

  return list
    .map((l, i) => {
      l.originalIndex = i;
      return l;
    })
    .filter(({ fullName }) => poolCanBeAdded(fullName));
}

export default Powerset;
