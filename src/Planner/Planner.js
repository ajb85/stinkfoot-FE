import React, { useState } from 'react';

import CharacterInfo from './CharacterInfo/';
import Powersets from './Powersets/';
import Powers from './Powers/';

import powersets from 'data/powersets.js';
import poolPowers from 'data/poolPowers.js';
import origins from 'data/origins.js';
import powersTemplate from 'data/powersTemplate.js';
import enhancementSlots from 'data/enhancementSlots.js';

import styles from './styles.module.scss';

function Planner(props) {
  const [build, setBuild] = useState({
    name: '',
    archetype: 'Blaster',
    origin: origins[0].name,
    alignment: 'Hero',
    primary: powersets.Blaster.primaries[0],
    secondary: powersets.Blaster.secondaries[0],
    poolPower: poolPowers[0],
    powerSlots: powersTemplate,
    poolPowers: [],
    enhancementSlots,
    activeLevel: 1,
    powerLookup: {},
    excludedPowersets: {},
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
        powerSlots: powersTemplate,
        enhancementSlots,
        activeLevel: 1,
        powerLookUp: {},
      });
    } else if (name === 'primary' || name === 'secondary') {
      const newPowerset = powersets[build.archetype][
        name === 'primary' ? 'primaries' : 'secondaries'
      ].find(({ fullName }) => fullName === value);
      const slotsToRemove = [];
      const powerSlots = build.powerSlots.map((powerSlot) => {
        if (powerSlot.powerType !== name) {
          return powerSlot;
        }
        const { level, type } = powerSlot;
        slotsToRemove.push(
          ...powerSlot.enhSlots.map(({ slotLevel }) => slotLevel)
        );
        return { level, type };
      });
      setBuild({
        ...build,
        [name]: newPowerset,
        powerSlots,
        enhancementSlots: _removeSlots(...slotsToRemove),
      });
    } else if (name === 'poolPower') {
      setBuild({
        ...build,
        [name]: poolPowers.find(({ fullName }) => fullName === value),
      });
    } else {
      setBuild({ ...build, [name]: value });
    }
  };

  const _assignLevel = (powersLevel) => {
    if (powersLevel <= build.activeLevel) {
      return build.activeLevel;
    }

    const nextAbovePowersLevel = build.powerSlots.find(
      ({ level, name }) => level >= powersLevel && !name
    );
    return nextAbovePowersLevel ? nextAbovePowersLevel.level : null;
  };

  const _removeSlots = (...slotLevels) => {
    console.log('REMOVE SLOTS: ', slotLevels);
    const updatedEnhSlots = [...build.enhancementSlots];
    slotLevels.forEach((lvl) => {
      const enhSlotIndex = updatedEnhSlots.findIndex(
        ({ value, inUse }) => value === lvl && inUse
      );
      if (enhSlotIndex > -1) {
        updatedEnhSlots[enhSlotIndex].inUse = false;
      } else {
        console.log('DID NOT FIND IN USE FOR ', lvl);
      }
    });

    return updatedEnhSlots;
  };

  const _togglePower = (p, powerType) => {
    const isPrimary = powerType === 'primary';
    if (build.powerLookup.hasOwnProperty(p.fullName)) {
      // Remove power that's been added
      const powerLookup = { ...build.powerLookup };
      const index = powerLookup[p.fullName];
      delete powerLookup[p.fullName];

      let powerSlotLevel;
      let slotsToRemove;
      const powerSlots = build.powerSlots.map((powerSlot, i) => {
        if (i !== index || powerSlot.type === 'default') {
          return powerSlot;
        }
        const { level, type, enhSlots } = powerSlot;
        slotsToRemove = enhSlots.slice(1).map(({ slotLevel }) => slotLevel);
        powerSlotLevel = level;
        return { level, type };
      });
      return {
        ...build,
        powerLookup,
        powerSlots,
        activeLevel:
          powerSlotLevel < build.activeLevel
            ? findLowestUnusedSlot(powerSlots)
            : build.activeLevel,
        enhancementSlots: _removeSlots(...slotsToRemove),
      };
    } else {
      const isPickingLevel1Power =
        p.level === 1 &&
        ((isPrimary && !build.powerSlots[0].name) ||
          (!isPrimary && !build.powerSlots[1].name));

      if (isPickingLevel1Power) {
        const powerSlots = [...build.powerSlots];
        const powerLookup = { ...build.powerLookup };
        if (isPrimary) {
          powerSlots[0] = {
            ...powerSlots[0],
            displayName: p.displayName,
            fullName: p.fullName,
            enhSlots: emptyDefaultSlot(),
            powerType,
          };
          powerLookup[p.fullName] = 0;
        }
        if (!powerSlots[1].name) {
          const power = build.secondary.powers.find(({ isEpic }) => !isEpic);
          powerSlots[1] = {
            ...powerSlots[1],
            displayName: power.displayName,
            fullName: power.fullName,
            enhSlots: emptyDefaultSlot(),
            powerType: 'secondary',
          };
          powerLookup[power.fullName] = 1;
        }
        return {
          ...build,
          powerSlots,
          powerLookup,
          activeLevel: findLowestUnusedSlot(powerSlots),
        };
      } else {
        let newIndex;
        const assignedLevel = _assignLevel(p.level);
        if (assignedLevel === null) {
          return;
        }

        const powerSlots = build.powerSlots.map((powerSlot, i) => {
          if (
            powerSlot.level !== assignedLevel ||
            powerSlot.type === 'default'
          ) {
            return powerSlot;
          }
          newIndex = i;
          return {
            ...powerSlot,
            displayName: p.displayName,
            fullName: p.fullName,
            enhSlots: emptyDefaultSlot(),
            powerType,
          };
        });

        return {
          ...build,
          powerSlots,
          powerLookup: {
            ...build.powerLookup,
            [p.fullName]: newIndex,
          },
          activeLevel:
            assignedLevel === build.activeLevel
              ? findLowestUnusedSlot(powerSlots)
              : build.activeLevel,
        };
      }
    }
  };

  const togglePower = (p, powerType) => {
    const newState = _togglePower(p, powerType);
    if (newState) {
      setBuild(newState);
    }
  };

  const addSlot = (powerIndex) => {
    const power = build.powerSlots[powerIndex];
    if (power.enhSlots.length < 6) {
      const slotIndex = build.enhancementSlots.findIndex(
        ({ value, inUse }) => value >= power.level && !inUse
      );
      const slot = build.enhancementSlots[slotIndex];
      if (slot) {
        setBuild({
          ...build,
          powerSlots: build.powerSlots.map((p, i) => {
            if (i !== powerIndex) {
              return p;
            }

            return {
              ...p,
              enhSlots: [...p.enhSlots, { slotLevel: slot.value }].sort(
                (a, b) => a.slotLevel - b.slotLevel
              ),
            };
          }),
          enhancementSlots: build.enhancementSlots.map((s, i) => {
            if (i !== slotIndex) {
              return s;
            }

            return { ...s, inUse: true };
          }),
        });
      }
    }
  };

  const removeSlot = (powerSlotIndex, slotIndex) => {
    if (slotIndex === 0) {
      return;
    }
    let slotToRemove;
    setBuild({
      ...build,
      powerSlots: build.powerSlots.map((powerSlot, i) => {
        if (i !== powerSlotIndex) {
          return powerSlot;
        }
        slotToRemove = powerSlot.enhSlots[slotIndex].slotLevel;
        return {
          ...powerSlot,
          enhSlots: powerSlot.enhSlots.filter((_, i) => i !== slotIndex),
        };
      }),
      enhancementSlots: _removeSlots(slotToRemove),
    });
  };

  const setActiveLevel = (activeLevel) => setBuild({ ...build, activeLevel });

  const addPowerFromNewPool = (p) => {
    const poolName = build.poolPower.fullName;
    const activePoolPowers = [...build.poolPowers];
    const excludedPowersets = { ...build.excludedPowersets };
    const poolCanBeAdded =
      activePoolPowers.length < 4 &&
      activePoolPowers.indexOf(poolName) === -1 &&
      !excludedPowersets.hasOwnProperty(poolName);

    if (poolCanBeAdded) {
      activePoolPowers.push(poolName);

      const pool = poolPowers.find(({ fullName }) => fullName === poolName);
      if (pool && pool.prevents) {
        pool.prevents.forEach((p) => {
          if (excludedPowersets.hasOwnProperty(p)) {
            excludedPowersets[p].push(pool.fullName);
          } else {
            excludedPowersets[p] = [pool.fullName];
          }
        });
      }
      const newPowerState = _togglePower(p, 'poolPower');

      const poolPower = poolPowers.find(({ fullName }) => {
        return (
          !build.excludedPowersets.hasOwnProperty(fullName) &&
          !build.poolPowers.find((activePool) => activePool === fullName) &&
          fullName !== build.poolPower.fullName
        );
      });

      setBuild({
        ...build,
        ...newPowerState,
        poolPowers: activePoolPowers,
        poolPower,
        excludedPowersets,
      });
    }
  };

  return (
    <div className={styles.Planner}>
      <header>
        <CharacterInfo
          build={build}
          updateBuild={updateBuild}
          setBuild={setBuild}
        />
      </header>
      <main>
        <Powersets
          build={build}
          updateBuild={updateBuild}
          togglePower={togglePower}
          addPowerFromNewPool={addPowerFromNewPool}
        />
        <Powers
          build={build}
          setActiveLevel={setActiveLevel}
          addSlot={addSlot}
          removeSlot={removeSlot}
        />
      </main>
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

function findLowestUnusedSlot(powers) {
  const nextLevel = powers.find(({ fullName }) => !fullName);
  return nextLevel ? nextLevel.level : null;
}

export default Planner;
