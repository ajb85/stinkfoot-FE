import React, { useState } from 'react';

import SelectAT from './SelectAT/';
import Powersets from './Powersets/';
import Powers from './Powers/';

import powersets from 'data/powersets.js';
import origins from 'data/origins.js';
import powersTemplate from 'data/powersTemplate.js';
import slots from 'data/slots.js';

function Planner(props) {
  const [build, setBuild] = useState({
    name: '',
    archetype: 'Blaster',
    origin: origins[0].name,
    alignment: 'Hero',
    primary: powersets.Blaster.primaries[0],
    secondary: powersets.Blaster.secondaries[0],
    powers: powersTemplate,
    slots,
    activeLevel: 1,
    powerLookup: {},
  });

  console.log('BUILD: ', build);

  const updateBuild = (e) => {
    const { name, value } = e.target;
    if (name === 'archetype') {
      const { primaries, secondaries } = powersets[value];
      setBuild({
        ...build,
        [name]: value,
        primary: primaries[0],
        secondary: secondaries[0],
      });
    } else if (name === 'primary' || name === 'secondary') {
      const newPowerset = powersets[build.archetype][
        name === 'primary' ? 'primaries' : 'secondaries'
      ].find(({ displayName }) => displayName === value);
      setBuild({ ...build, [name]: newPowerset });
    } else {
      setBuild({ ...build, [name]: value });
    }
  };

  const _findNextActive = (assignedLevel = build.activeLevel) => {
    const nextLevel = build.powers.find(
      ({ level, name }) => level > assignedLevel && !name
    );
    if (nextLevel) {
      return nextLevel.level;
    }

    const firstEmpty = build.powers.find(({ name }) => !name);

    return firstEmpty ? firstEmpty.level : null;
  };

  const _assignLevel = (powersLevel) => {
    if (powersLevel <= build.activeLevel) {
      return build.activeLevel;
    }

    const nextAbovePowersLevel = build.powers.find(
      ({ level, name }) => level >= powersLevel && !name
    );
    return nextAbovePowersLevel ? nextAbovePowersLevel.level : null;
  };

  const togglePower = (p, isPrimary) => {
    if (build.powerLookup.hasOwnProperty(p.displayName)) {
      // Remove power that's been added
      const powerLookup = { ...build.powerLookup };
      const index = powerLookup[p.displayName];
      delete powerLookup[p.displayName];

      let activeLevel;
      const powers = build.powers.map((powerSlot, i) => {
        if (i !== index || powerSlot.type === 'default') {
          return powerSlot;
        }
        activeLevel = powerSlot.level;
        const { level, type } = powerSlot;
        return { level, type };
      });
      setBuild({
        ...build,
        powerLookup,
        powers,
        activeLevel,
      });
    } else {
      if (p.level === 1 && !build.powers[1].name) {
        const newPowers = [...build.powers];
        const powerLookup = { ...build.powerLookup };
        if (isPrimary) {
          newPowers[0] = {
            ...newPowers[0],
            name: p.displayName,
            slots: emptyDefaultSlot(),
          };
          powerLookup[p.displayName] = 0;
        }
        if (!newPowers[1].name) {
          const powerName = build.secondary.powers.find(({ isEpic }) => !isEpic)
            .displayName;
          newPowers[1] = {
            ...newPowers[1],
            name: powerName,
            slots: emptyDefaultSlot(),
          };
          powerLookup[powerName] = 1;
        }
        setBuild({
          ...build,
          powers: newPowers,
          powerLookup,
          activeLevel: _findNextActive(),
        });
      } else {
        let newIndex;
        const assignedLevel = _assignLevel(p.level);
        if (assignedLevel === null) {
          return;
        }

        const powers = build.powers.map((powerSlot, i) => {
          if (
            powerSlot.level !== assignedLevel ||
            powerSlot.type === 'default'
          ) {
            return powerSlot;
          }
          newIndex = i;
          return {
            ...powerSlot,
            name: p.displayName,
            slots: emptyDefaultSlot(),
          };
        });
        setBuild({
          ...build,
          powers,
          powerLookup: {
            ...build.powerLookup,
            [p.displayName]: newIndex,
          },
          activeLevel: _findNextActive(assignedLevel),
        });
      }
    }
  };

  return (
    <div>
      <SelectAT build={build} updateBuild={updateBuild} setBuild={setBuild} />
      <Powersets
        build={build}
        updateBuild={updateBuild}
        togglePower={togglePower}
      />
      <Powers build={build} />
    </div>
  );
}

function emptyDefaultSlot() {
  return [
    {
      slotLevel: null,
    },
  ];
}

export default Planner;
