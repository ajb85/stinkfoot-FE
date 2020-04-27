import powersets from 'data/powersets.js';
import poolPowers from 'data/poolPowers.js';
import origins from 'data/origins.js';
import powerSlotsTemplate from 'data/powerSlotsTemplate.js';
import enhancementSlots from 'data/enhancementSlots.js';

export default class BuildManager {
  constructor(build, setBuild) {
    this.build = build;
    this.setBuild = setBuild;
  }

  static initialState() {
    return {
      name: '',
      archetype: 'Blaster',
      origin: origins[0].name,
      alignment: 'Hero',
      primaryIndex: 0,
      secondaryIndex: 0,
      poolPowerIndex: 0,
      powerSlots: powerSlotsTemplate,
      poolPowers: [],
      enhancementSlots,
      activeLevel: 1,
      powerLookup: {},
      excludedPowersets: {},
    };
  }

  get activePrimary() {
    return powersets[this.build.archetype].primaries[this.build.primaryIndex];
  }

  get primaries() {
    return powersets[this.build.archetype].primaries;
  }

  get secondaries() {
    return powersets[this.build.archetype].secondaries;
  }

  get activeSecondary() {
    return powersets[this.build.archetype].secondaries[
      this.build.secondaryIndex
    ];
  }

  get activePool() {
    return poolPowers[this.build.poolPower];
  }

  getPower(order, index) {
    return powersets[this.build.archetypeOrder][order].powers[index];
  }

  updateBuild = (e) => {
    const specialCases = {
      archetype: true,
      primary: true,
      secondary: true,
      poolPower: true,
    };

    const { name, value } = e.target;
    this.setBuild(
      specialCases[name]
        ? this._handleSpecialCases(name, value)
        : { ...this.build, [name]: value }
    );
  };

  togglePower = (p, powerType) => {
    const newState = this._togglePower(p, powerType);
    if (newState) {
      this.setBuild(newState);
    }
  };

  addSlot = (powerSlotIndex) => {
    const powerSlot = this.build.powerSlots[powerSlotIndex];
    if (powerSlot.enhSlots.length < 6) {
      const slotIndex = this.build.enhancementSlots.findIndex(
        ({ level, inUse }) => level >= powerSlot.level && !inUse
      );
      if (slotIndex > -1) {
        const slot = this.build.enhancementSlots[slotIndex];
        const powerSlots = this.build.powerSlots.map((ps, i) => {
          if (i !== powerSlotIndex) {
            return ps;
          }

          return {
            ...ps,
            enhSlots: [...ps.enhSlots, { slotLevel: slot.value }].sort(
              (a, b) => a.slotLevel - b.slotLevel
            ),
          };
        });
        const enhancementSlots = this.build.enhancementSlots.map((s, i) => {
          if (i !== slotIndex) {
            return s;
          }

          return { ...s, inUse: true };
        });

        this.setBuild({
          ...this.build,
          powerSlots,
          enhancementSlots,
        });
      }
    }
  };

  removeSlot = (powerSlotIndex, slotIndices) => {
    slotIndices = Array.isArray(slotIndices) ? slotIndices : [slotIndices];
    const slotIndexLookup = slotIndices.reduce(
      (acc, sIndex) => {
        if (sIndex !== 0 && !acc[sIndex]) {
          // Slot 0 is automatically given.  Since it cannot be added,
          // it cannot be removed.
          acc[sIndex] = true;
          acc.length++;
        }

        return acc;
      },
      { length: 0 }
    );

    if (!slotIndexLookup.length) {
      return;
    }

    const slotsToRemove = [];
    const powerSlots = this.build.powerSlots.map((powerSlot, i) => {
      if (i !== powerSlotIndex) {
        return powerSlot;
      }

      powerSlot.enhSlots.forEach(({ slotLevel }, i) => {
        if (slotIndexLookup[i]) {
          slotsToRemove.push(slotLevel);
        }
      });

      return {
        ...powerSlot,
        enhSlots: powerSlot.enhSlots.filter((_, i) => !slotIndexLookup[i]),
      };
    });

    this.setBuild({
      ...this.build,
      powerSlots,
      enhancementSlots: this._removeSlots(...slotsToRemove),
    });
  };

  setActiveLevel = (activeLevel) =>
    this.setBuild({ ...this.build, activeLevel });

  addPowerFromNewPool = (p) => {
    const pool = this.activePool;
    if (!pool) {
      throw new Error('No active pool found');
    }
    const poolName = pool.fullName;
    const activePoolPowers = [...this.build.poolPowers];
    const excludedPowersets = { ...this.build.excludedPowersets };
    const poolCanBeAdded =
      activePoolPowers.length < 4 &&
      activePoolPowers.indexOf(poolName) === -1 &&
      !excludedPowersets.hasOwnProperty(poolName);

    if (!poolCanBeAdded) {
      return;
    }

    activePoolPowers.push(poolName);

    if (pool.prevents) {
      pool.prevents.forEach((p) => {
        if (excludedPowersets.hasOwnProperty(p)) {
          excludedPowersets[p].push(pool.fullName);
        } else {
          excludedPowersets[p] = [pool.fullName];
        }
      });
    }

    const newPowerState = this._togglePower(p, 'poolPower');
    if (newPowerState) {
      const nextDefaultPoolPowersetIndex = poolPowers.findIndex(
        ({ fullName }) => {
          return (
            !this.build.excludedPowersets.hasOwnProperty(fullName) &&
            !this.build.poolPowers.find(
              (activePool) => activePool === fullName
            ) &&
            fullName !== this.build.poolPower.fullName
          );
        }
      );

      this.setBuild({
        ...this.build,
        ...newPowerState,
        poolPowers: activePoolPowers,
        poolPowerIndex: nextDefaultPoolPowersetIndex,
        excludedPowersets,
      });
    }
  };

  toggleAlignment = () => {
    this.setBuild({
      ...this.build,
      alignment: this.build.alignment === 'Hero' ? 'Villain' : 'Hero',
    });
  };

  _assignLevel = (powersLevel) => {
    if (powersLevel <= this.build.activeLevel) {
      // If the user selects a skill that fits into the active slot,
      // use the active slot
      return this.build.activeLevel;
    }

    // Otherwise, find a slot that is open & >= the skill's level
    const nextAbovePowerSlotIndex = this.build.powerSlots.findIndex(
      ({ level, power }) => level >= powersLevel && !power
    );

    return nextAbovePowerSlotIndex > -1 ? nextAbovePowerSlotIndex : null;
  };

  _removeSlots = (...slotLevels) => {
    const updatedEnhSlots = [...this.build.enhancementSlots];
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

  _togglePower = (p, powerIndex) => {
    const isPrimary = p.archetypeOrder === 'primary';
    const powerLookup = { ...this.build.powerLookup };
    if (this.build.powerLookup.hasOwnProperty(p.fullName)) {
      // Remove power that's been added
      const index = powerLookup[p.fullName];
      delete powerLookup[p.fullName];

      let powerSlotLevel;
      let slotsToRemove;
      const powerSlots = this.build.powerSlots.map((powerSlot, i) => {
        if (i !== index || powerSlot.type === 'default') {
          return powerSlot;
        }
        const { level, type, enhSlots } = powerSlot;
        slotsToRemove = enhSlots.slice(1).map(({ slotLevel }) => slotLevel);
        powerSlotLevel = level;
        return { level, type };
      });
      return {
        ...this.build,
        powerLookup,
        powerSlots,
        activeLevel:
          powerSlotLevel < this.build.activeLevel
            ? findLowestUnusedSlot(powerSlots)
            : this.build.activeLevel,
        enhancementSlots: this._removeSlots(...slotsToRemove),
      };
    } else {
      const isPickingLevel1Power =
        p.level === 1 &&
        ((isPrimary && !this.build.powerSlots[0].power) ||
          (!isPrimary && !this.build.powerSlots[1].power));

      if (isPickingLevel1Power) {
        const powerSlots = [...this.build.powerSlots];
        if (isPrimary) {
          // If the user selected one of the two primary level 1 powers, save it
          powerSlots[0] = {
            ...powerSlots[0],
            power: { archetypeOrder: p.archetypeOrder, index: powerIndex },
            enhSlots: emptyDefaultSlot(),
          };
          powerLookup[p.fullName] = 0;
        }
        if (!powerSlots[1].power) {
          // Regardless if a secondary power was picked or not,
          // set the only power available at level 1 by default
          const power = this.activeSecondary.powers.find(
            ({ isEpic }) => !isEpic
          );
          powerSlots[1] = {
            ...powerSlots[1],
            power: { archetypeOrder: 'secondary', index: 0 },
            enhSlots: emptyDefaultSlot(),
          };
          powerLookup[power.fullName] = 1;
        }
        return {
          ...this.build,
          powerSlots,
          powerLookup,
          activeLevel: findLowestUnusedSlot(powerSlots),
        };
      } else {
        return addPowerToPowerSlot();
      }
    }

    function addPowerToPowerSlot(
      powerSlotIndex,
      newPowersIndex,
      archetypeOrder
    ) {
      if (!powerSlotIndex) {
        // If data isn't given, pull from the power's info
        powerSlotIndex = this._assignLevel(p.level);
      }

      if (powerSlotIndex === null) {
        // There are no power slots left that can support the ability
        return;
      }

      if (!archetypeOrder) {
        // If data isn't given, pull from the power's info
        archetypeOrder = p.archetypeOrder;
      }

      const index = newPowersIndex ? newPowersIndex : powerIndex;

      const powerSlots = [...this.build.powerSlots];
      powerSlots[powerSlotIndex] = {
        ...powerSlots[powerSlotIndex],
        power: { archetypeOrder, index },
        enhSlots: emptyDefaultSlot(),
      };

      return {
        ...this.build,
        powerSlots,
        powerLookup: {
          ...this.build.powerLookup,
          [p.fullName]: powerSlotIndex,
        },
        activeLevel: findLowestUnusedSlot(powerSlots),
        // this.build.powerSlots[powerSlotIndex].level === this.build.activeLevel
        // ? findLowestUnusedSlot(powerSlots)
        // : this.build.activeLevel,
      };
    }
  };

  _handleSpecialCases(name, value) {
    switch (name) {
      case 'archetype':
        const { primaries, secondaries } = powersets[value];
        return {
          ...this.constructor.initialState(),
          [name]: value,
          primary: primaries[0],
          secondary: secondaries[0],
        };
      case 'primary':
      case 'secondary':
        const psOrder = name === 'primary' ? 'primaries' : 'secondaries';
        const newPowerset = powersets[this.build.archetype][psOrder].find(
          ({ displayName }) => displayName === value
        );
        const slotsToRemove = [];
        const powerSlots = this.build.powerSlots.map((powerSlot) => {
          // Remove all powers and enh slots belonging to primary/secondary
          // being changed
          if (powerSlot.power.archetypeOrder !== name) {
            return powerSlot;
          }
          const { level, type } = powerSlot;
          slotsToRemove.push(
            ...powerSlot.enhSlots.map(({ slotLevel }) => slotLevel)
          );
          return { level, type };
        });
        return {
          ...this.build,
          [name]: newPowerset,
          powerSlots,
          enhancementSlots: this._removeSlots(...slotsToRemove),
        };
      case 'poolPower':
        return {
          ...this.build,
          [name]: poolPowers.find(({ displayName }) => displayName === value),
        };
      default:
        return this.build;
    }
  }
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
