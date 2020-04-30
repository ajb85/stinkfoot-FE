import powersets from 'data/powersets.js';
import poolPowers from 'data/poolPowers.js';
import epicPools from 'data/epicPools.js';
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
      epicPoolIndex: 0,
      powerSlots: powerSlotsTemplate,
      poolPowers: [],
      enhancementSlots,
      activeLevelIndex: 0,
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

  get pools() {
    return poolPowers;
  }

  get activeSecondary() {
    return powersets[this.build.archetype].secondaries[
      this.build.secondaryIndex
    ];
  }

  get activePool() {
    return poolPowers[this.build.poolPowerIndex];
  }

  get selectedPoolLookup() {
    return this.build.poolPowers.reduce((acc, index) => {
      acc[poolPowers[index].fullName] = true;
      return acc;
    }, {});
  }

  get activeLevel() {
    return this.build.powerSlots[this.build.activeLevelIndex].level;
  }

  get epicPools() {
    return epicPools[this.build.archetype];
  }

  get activeEpicPool() {
    return epicPools[this.build.archetype][this.build.epicPoolIndex];
  }

  getPower = (power) => {
    if (!power) {
      return null;
    }
    const { archetypeOrder, powerIndex, poolIndex } = power;
    if (!archetypeOrder || (!powerIndex && powerIndex !== 0)) {
      console.log('MISSING DATA: ', archetypeOrder, powerIndex);
      return null;
    }
    const setOfPowers = {
      primary:
        powersets[this.build.archetype].primaries[this.build.primaryIndex]
          .powers,
      secondary:
        powersets[this.build.archetype].secondaries[this.build.secondaryIndex]
          .powers,
      poolPower: poolPowers[poolIndex || 0].powers,
      epicPool:
        epicPools[this.build.archetype][this.build.epicPoolIndex].powers,
    };

    return setOfPowers[archetypeOrder][powerIndex];
  };

  updateBuild = (e) => {
    const specialCases = {
      archetype: true,
      primaryIndex: true,
      secondaryIndex: true,
      poolPower: true,
      epicPoolIndex: true,
    };

    const { name, value } = e.target;
    this.setBuild(
      specialCases[name]
        ? this._handleSpecialCases(name, value)
        : { ...this.build, [name]: value }
    );
  };

  togglePower = (p, poolIndex) => {
    const newState = this._togglePower(p, poolIndex);
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
            enhSlots: [...ps.enhSlots, { slotLevel: slot.level }].sort(
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

  doesBuildHavePower(power) {
    if (!power) {
      return null;
    }
    return this.build.powerLookup.hasOwnProperty(power.fullName);
  }

  setActiveLevelIndex = (activeLevelIndex) =>
    this.setBuild({ ...this.build, activeLevelIndex });

  addPowerFromNewPool = (p) => {
    const pool = this.activePool;
    if (!pool) {
      throw new Error('No active pool found');
    }
    const poolName = pool.fullName;
    const { poolPowerIndex } = this.build;
    const activePoolPowers = [...this.build.poolPowers];
    const excludedPowersets = { ...this.build.excludedPowersets };
    const poolCanBeAdded =
      activePoolPowers.length < 4 &&
      activePoolPowers.indexOf(poolPowerIndex) === -1 &&
      !excludedPowersets.hasOwnProperty(poolName);

    if (!poolCanBeAdded) {
      return;
    }

    activePoolPowers.push(poolPowerIndex);

    if (pool.prevents) {
      pool.prevents.forEach((p) => {
        if (excludedPowersets.hasOwnProperty(p)) {
          excludedPowersets[p].push(pool.displayName);
        } else {
          excludedPowersets[p] = [pool.displayName];
        }
      });
    }

    const newPowerState = this._togglePower(p, poolPowerIndex);
    if (newPowerState) {
      const nextDefaultPoolPowersetIndex = poolPowers.findIndex(
        ({ fullName }, i) => {
          return (
            !this.build.excludedPowersets.hasOwnProperty(fullName) &&
            this.build.poolPowers.indexOf(i) === -1 &&
            i !== this.build.poolPowerIndex
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

  removePool = (poolIndexToRemove) => {
    const activePowers = this.build.powerSlots.reduce((acc, powerSlot) => {
      if (powerSlot.power) {
        const {
          power: { archetypeOrder, poolIndex, powerIndex },
        } = powerSlot;
        if (archetypeOrder === 'poolPower' && poolIndex === poolIndexToRemove) {
          acc.push(poolPowers[poolIndex].powers[powerIndex]);
        }
      }
      return acc;
    }, []);

    const pool = poolPowers[poolIndexToRemove];

    const excludedPowersets = { ...this.build.excludedPowersets };
    if (pool.prevents) {
      pool.prevents.forEach((ps) => {
        if (excludedPowersets[ps] && excludedPowersets[ps].length === 1) {
          delete excludedPowersets[ps];
        } else if (excludedPowersets[ps]) {
          excludedPowersets[ps] = excludedPowersets[ps].filter(
            (psName) => psName !== ps
          );
        } else {
          console.log("Whoops, didn't find ", ps, ' in the exclusion list.');
        }
      });
    }

    this.setBuild({
      ...this._removePowers(...activePowers),
      excludedPowersets,
      poolPowers: this.build.poolPowers.filter(
        (index) => index !== poolIndexToRemove
      ),
    });
  };

  _assignPowerSlotIndex = (powersLevel) => {
    if (powersLevel <= this.activeLevel) {
      // If the user selects a skill that fits into the active slot,
      // use the active slot
      return this.build.activeLevelIndex;
    }

    // Otherwise, find a slot that is open & >= the skill's level
    const nextAbovePowerSlotIndex = this.build.powerSlots.findIndex(
      ({ level, power }) => level >= powersLevel && !power
    );

    return nextAbovePowerSlotIndex > -1 ? nextAbovePowerSlotIndex : null;
  };

  _removeSlots = (...slotLevels) => {
    const updatedEnhSlots = [...this.build.enhancementSlots];
    if (slotLevels.length) {
      slotLevels
        .filter((lvl) => !isNaN(parseInt(lvl, 10)))
        .forEach((lvl) => {
          const enhSlotIndex = updatedEnhSlots.findIndex(
            ({ level, inUse }) => level === lvl && inUse
          );
          if (enhSlotIndex > -1) {
            updatedEnhSlots[enhSlotIndex].inUse = false;
          } else {
            console.log('DID NOT FIND IN USE FOR ', lvl);
          }
        });
    }

    return updatedEnhSlots;
  };

  _togglePower = (p, poolIndex) => {
    const isPrimary = p.archetypeOrder === 'primary';
    const { powerIndex } = p;
    const powerLookup = { ...this.build.powerLookup };
    if (this.build.powerLookup.hasOwnProperty(p.fullName)) {
      return this._removePowers(p);
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
            power: { archetypeOrder: p.archetypeOrder, powerIndex: powerIndex },
            enhSlots: emptyDefaultSlot(),
          };
          powerLookup[p.fullName] = 0;
        }
        if (!powerSlots[1].power) {
          // Regardless if a secondary power was picked or not,
          // set the only power available at level 1 by default
          const power = this.activeSecondary.powers[0];
          powerSlots[1] = {
            ...powerSlots[1],
            power: { archetypeOrder: 'secondary', powerIndex: 0 },
            enhSlots: emptyDefaultSlot(),
          };
          powerLookup[power.fullName] = 1;
        }
        return {
          ...this.build,
          powerSlots,
          powerLookup,
          activeLevelIndex: findLowestUnusedSlot(powerSlots),
        };
      } else {
        return addPowerToPowerSlot.call(this);
      }
    }

    function addPowerToPowerSlot(
      powerSlotIndex = this._assignPowerSlotIndex(p.level),
      newPowersIndex = powerIndex,
      archetypeOrder = p.archetypeOrder
    ) {
      if (powerSlotIndex === null) {
        // There are no power slots left that can support the ability
        return;
      }

      const powerSlots = [...this.build.powerSlots];
      powerSlots[powerSlotIndex] = {
        ...powerSlots[powerSlotIndex],
        power: { archetypeOrder, powerIndex: newPowersIndex, poolIndex },
        enhSlots: emptyDefaultSlot(),
      };

      return {
        ...this.build,
        powerSlots,
        powerLookup: {
          ...this.build.powerLookup,
          [p.fullName]: powerSlotIndex,
        },
        activeLevelIndex: findLowestUnusedSlot(powerSlots),
        // this.build.powerSlots[powerSlotIndex].level === this.build.activeLevel
        // ? findLowestUnusedSlot(powerSlots)
        // : this.build.activeLevel,
      };
    }
  };

  _removePowers = (...powers) => {
    if (!powers.length) {
      return { ...this.build };
    }
    // Remove power that's been added
    const powerLookup = { ...this.build.powerLookup };
    const powerSlotIndicesRemoved = powers.reduce((acc, p) => {
      if (powerLookup.hasOwnProperty(p.fullName)) {
        acc[powerLookup[p.fullName]] = true;
        delete powerLookup[p.fullName];
      }

      return acc;
    }, {});
    let powerSlotIndex;
    let slotsToRemove = [];
    const powerSlots = this.build.powerSlots.map((powerSlot, i) => {
      if (
        !powerSlotIndicesRemoved.hasOwnProperty(i) ||
        powerSlot.type === 'default'
      ) {
        return powerSlot;
      }
      const { level, type, enhSlots } = powerSlot;
      slotsToRemove.push(
        ...enhSlots.slice(1).map(({ slotLevel }) => slotLevel)
      );
      powerSlotIndex = i;
      return { level, type };
    });

    const enhancementSlots = this._removeSlots(...slotsToRemove);
    return {
      ...this.build,
      powerLookup,
      powerSlots,
      activeLevelIndex:
        powerSlotIndex < this.build.activeLevelIndex
          ? findLowestUnusedSlot(powerSlots)
          : this.build.activeLevelIndex,
      enhancementSlots,
    };
  };

  _handleSpecialCases = (name, value) => {
    switch (name) {
      case 'archetype':
        const { primaries, secondaries } = powersets[value];
        return {
          ...this.constructor.initialState(),
          [name]: value,
          primary: primaries[0],
          secondary: secondaries[0],
        };
      case 'primaryIndex':
      case 'secondaryIndex':
      case 'epicPoolIndex':
        const archetypeOrder = name.substring(0, name.length - 5);
        const activeSet = this[
          `active${archetypeOrder[0].toUpperCase + archetypeOrder.substring(1)}`
        ];
        const powersToRemove = this.build.powerSlots.reduce(
          (acc, powerSlot) => {
            if (powerSlot.power) {
              if (powerSlot.power.archetypeOrder === archetypeOrder) {
                acc.push(activeSet.powers[powerSlot.power.powerIndex]);
              }
            }
            return acc;
          },
          []
        );
        return {
          ...this._removePowers(...powersToRemove),
          [name]: parseInt(value, 10),
        };
      // case 'poolPowerIndex':
      //   return {
      //     ...this.build,
      //     [name]: poolPowers.find(({ displayName }) => displayName === value),
      //   };
      default:
        return this.build;
    }
  };

  _pluralizeOrder = (order) => {
    const toPlural = {
      primary: 'primaries',
      secondary: 'secondaries',
      poolPower: 'poolPowers',
      epicPower: 'epicPowers',
    };

    return toPlural[order] || order;
  };
}

function emptyDefaultSlot() {
  return [
    {
      slotLevel: null,
    },
  ];
}

function findLowestUnusedSlot(powerSlots) {
  const nextEmptySlotIndex = powerSlots.findIndex(({ power }) => !power);
  return !isNaN(parseInt(nextEmptySlotIndex)) ? nextEmptySlotIndex : null;
}
