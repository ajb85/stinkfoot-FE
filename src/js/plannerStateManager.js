import powersets from 'data/powersets.js';
import poolPowers from 'data/poolPowers.js';
import epicPools from 'data/epicPools.js';
import origins from 'data/origins.js';
import powerSlotsTemplate from 'data/powerSlotsTemplate.js';
import enhancementSlots from 'data/enhancementSlots.js';
import enhancements from 'data/enhancements.js';

export default class BuildManager {
  constructor(state, setState) {
    this.state = state;
    this.setState = setState;
  }

  static initialState() {
    return {
      build: {
        name: '',
        archetype: 'Blaster',
        origin: origins[0].name,
        alignment: 'Hero',
        powerSlots: powerSlotsTemplate,
        poolPowers: [],
      },
      tracking: {
        primaryIndex: 0,
        secondaryIndex: 0,
        poolPowerIndex: 0,
        epicPoolIndex: 0,
        activeLevelIndex: 0,
        powerSlotIndex: null,
      },
      lookup: {
        powers: {},
        excludedPowersets: {},
        enhancements: {},
      },
      reference: { enhancementSlots },
    };
  }

  get primaries() {
    return powersets[this.state.build.archetype].primaries;
  }

  get activePrimary() {
    return powersets[this.state.build.archetype].primaries[
      this.state.tracking.primaryIndex
    ];
  }

  get secondaries() {
    return powersets[this.state.build.archetype].secondaries;
  }

  get activeSecondary() {
    return powersets[this.state.build.archetype].secondaries[
      this.state.tracking.secondaryIndex
    ];
  }

  get pools() {
    return poolPowers;
  }

  get activePool() {
    return poolPowers[this.state.tracking.poolPowerIndex];
  }

  get selectedPoolDisplayNames() {
    return this.state.build.poolPowers.map(
      (index) => poolPowers[index].displayName
    );
  }

  get selectedPoolPowers() {
    return this.state.build.poolPowers;
  }

  get epicPools() {
    return epicPools[this.state.build.archetype];
  }

  get activeEpicPool() {
    return epicPools[this.state.build.archetype][
      this.state.tracking.epicPoolIndex
    ];
  }

  get selectedPoolLookup() {
    return this.state.build.poolPowers.reduce((acc, index) => {
      acc[poolPowers[index].fullName] = true;
      return acc;
    }, {});
  }

  get activeLevel() {
    return this.state.build.powerSlots[this.state.tracking.activeLevelIndex]
      .level;
  }

  get archetypes() {
    return Object.keys(powersets);
  }

  get archetype() {
    return this.state.build.archetype;
  }

  get buildName() {
    return this.state.build.name;
  }

  get build() {
    return this.state.build;
  }

  get origins() {
    return origins;
  }

  get origin() {
    return this.state.build.origin;
  }

  get powerSlots() {
    return this.state.build.powerSlots;
  }

  get toggledPowerSlotIndex() {
    return this.state.tracking.powerSlotIndex;
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
        powersets[this.state.build.archetype].primaries[
          this.state.tracking.primaryIndex
        ].powers,
      secondary:
        powersets[this.state.build.archetype].secondaries[
          this.state.tracking.secondaryIndex
        ].powers,
      poolPower: poolPowers[poolIndex || 0].powers,
      epicPool:
        epicPools[this.state.build.archetype][this.state.tracking.epicPoolIndex]
          .powers,
    };

    return setOfPowers[archetypeOrder][powerIndex];
  };

  getEnhancementSectionForPower = (power, section) => {
    const enhImages = require.context('Planner/images/enhancements', true);

    if (!power.slottable) {
      return {
        standard: [],
      };
    }

    if (section === 'standard') {
      return power.allowedEnhancements.reduce((acc, enhName) => {
        const { imageName, ...enh } = { ...enhancements.standard[enhName] };
        if (!imageName) {
          console.log('MISSING DATA: ', enhName);
        }
        enh.image = enhImages(`./${imageName}`);
        acc.push(enh);
        return acc;
      }, []);
    }
  };

  getEnhancementAndOverlayImages = (powerSlotEnhData) => {
    const { displayName, tier } = powerSlotEnhData;
    const enhImages = require.context('Planner/images/enhancements', true);

    return {
      enhancement: enhImages(`./${displayName.split(' ').join('_')}.png`),
      overlay: this.getEnhancementOverlay(tier),
    };
  };

  getEnhancementOverlay = (tier) => {
    const images = require.context('Planner/images/overlays', true);
    const oData = this.origins.find((o) => o.name === this.origin);

    switch (tier) {
      case 'IO':
        return images('./IO.png');
      case 'TO':
        return images('./TO.png');
      case 'SO':
      case 'DO':
        return images(`./${oData[tier]}.png`);
      default:
        return images('./OldClass.png');
    }
  };

  getOriginImage = (originName) => {
    const oImages = require.context('Planner/images/origins', true);
    return oImages(`./${originName}.png`);
  };

  getArchetypeImage = (atName) => {
    const atImages = require.context('Planner/images/archetypes', true);
    return atImages('./' + atName.split(' ').join('_') + '.png');
  };

  getPowersetImage = (imageName) => {
    if (!imageName) {
      return null;
    }

    imageName = imageName.imageName ? imageName.imageName : imageName;

    const images = require.context('Planner/images/powersets', true);
    return images(`./${imageName}`);
  };

  getFromState = (key) => {
    for (let section in this.state) {
      if (this.state[section].hasOwnProperty(key)) {
        return this.state[section][key];
      }
    }
  };

  getPowerSlotIndexByPowerName = (powerFullName) => {
    const index = this.state.build.powerSlots.findIndex(({ power }) => {
      const p = this.getPower(power);
      return p && p.fullName === powerFullName;
    });
    return index > -1 ? index : null;
  };

  isPowersetExcluded = (powersetFullName) => {
    return this.state.lookup.excludedPowersets.hasOwnProperty(powersetFullName);
  };

  buildHasPower = (powerFullName) => {
    if (!powerFullName) {
      return null;
    }

    powerFullName = powerFullName.fullName
      ? powerFullName.fullName
      : powerFullName;
    return this.state.lookup.powers.hasOwnProperty(powerFullName);
  };

  buildHasPool = (poolFullName) => {
    return this.selectedPoolLookup[poolFullName] || false;
  };

  poolCanBeAdded = (poolFullName) => {
    return (
      !this.isPowersetExcluded(poolFullName) && !this.buildHasPool(poolFullName)
    );
  };

  updateBuild = (e) => {
    this._updateState(e, 'build');
  };

  updateTracking = (e) => {
    this._updateState(e, 'tracking');
  };

  togglePower = (p, poolIndex) => {
    const newState = this._togglePowerReturnState(p, poolIndex);
    if (newState) {
      this.setState(newState);
    }
  };

  addSlot = (powerSlotIndex) => {
    const {
      powerSlots,
      enhancementSlots,
    } = this._addPowerSlotReturnSlotAndEnhState(powerSlotIndex);
    this.setState({
      ...this.state,
      build: { ...this.state.build, powerSlots },
      reference: { ...this.state.reference, enhancementSlots },
    });
  };

  removeSlot = (powerSlotIndex, slotIndices) => {
    slotIndices = Array.isArray(slotIndices) ? slotIndices : [slotIndices];
    const slotIndexLookup = slotIndices.reduce(
      (acc, sIndex) => {
        if (!acc[sIndex]) {
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

    const enhancements = { ...this.state.lookup.enhancements };
    for (let k in enhancements) {
      // Deep copy
      enhancements[k] = [...enhancements[k].map(({ s }) => ({ ...s }))];
    }

    const slotsToRemove = [];
    const powerSlots = this.state.build.powerSlots.map((powerSlot, i) => {
      if (i !== powerSlotIndex) {
        return powerSlot;
      }

      const enhSlots = [...powerSlot.enhSlots];

      enhSlots.forEach((enh, i) => {
        const { slotLevel, enhancement } = enh;
        if (i > 0 && slotIndexLookup[i]) {
          slotsToRemove.push(slotLevel);
        } else if (i === 0 && slotIndexLookup[i]) {
          // Don't want to delete zero index, since it's automatically given for a power
          // However, if the user is removing that slot, just delete any enhancements in it
          enhSlots[0] = { slotLevel: null };
        }

        if (enhancement) {
          const powerName = this.getPower(powerSlot.power).displayName;
          if (!enhancements[enhancement.fullName]) {
          } else if (
            enhancements[enhancement.fullName].length === 1 &&
            enhancements[enhancement.fullName][0].count === 1
          ) {
            delete enhancements[enhancement.fullName];
          } else {
            const enhRecords = enhancements[enhancement.fullName];
            const indexToRemove = enhRecords.findIndex(
              (power) => power.powerName === powerName
            );

            enhancements[enhancement.fullName] = enhRecords.reduce(
              (acc, p, i) => {
                if (i !== indexToRemove) {
                  acc.push(p);
                  return acc;
                }
                const { count } = p;

                if (count > 1) {
                  acc.push({ ...p, count: count - 1 });
                }
              },
              []
            );
          }
        }
      });

      return {
        ...powerSlot,
        enhSlots: enhSlots.filter((_, i) => i === 0 || !slotIndexLookup[i]),
      };
    });

    this.setState({
      ...this.state,
      build: { ...this.state.build, powerSlots },
      lookup: { ...this.state.lookup, enhancements },
      reference: {
        ...this.state.reference,
        enhancementSlots: this._removeSlotsReturnSlotState(...slotsToRemove),
      },
    });
  };

  addPowerFromNewPool = (p) => {
    const pool = this.activePool;
    if (!pool) {
      throw new Error('No active pool found');
    }
    const poolName = pool.fullName;
    const { poolPowerIndex } = this.state.tracking;
    const activePoolPowers = [...this.state.build.poolPowers];
    const poolCanBeAdded =
      activePoolPowers.length < 4 &&
      activePoolPowers.indexOf(poolPowerIndex) === -1 &&
      !this.isPowersetExcluded(poolName);

    if (!poolCanBeAdded) {
      return;
    }

    activePoolPowers.push(poolPowerIndex);

    const newState = this._togglePowerReturnState(p, poolPowerIndex);
    if (newState) {
      const nextDefaultPoolPowersetIndex = poolPowers.findIndex(
        ({ fullName }, i) => {
          return (
            !this.isPowersetExcluded(fullName) &&
            this.state.build.poolPowers.indexOf(i) === -1 &&
            i !== this.state.tracking.poolPowerIndex
          );
        }
      );

      this.setState({
        ...newState,
        build: {
          ...newState.build,
          poolPowers: activePoolPowers,
        },
        tracking: {
          ...newState.tracking,
          poolPowerIndex: nextDefaultPoolPowersetIndex,
        },
        lookup: {
          ...newState.lookup,
          excludedPowerSets: this._excludePowersetsReturnExcluded(
            pool.prevents,
            pool.displayName
          ),
        },
      });
    }
  };

  removePool = (poolIndexToRemove) => {
    const activePowers = this.state.build.powerSlots.reduce(
      (acc, powerSlot) => {
        if (powerSlot.power) {
          const {
            power: { archetypeOrder, poolIndex, powerIndex },
          } = powerSlot;
          if (
            archetypeOrder === 'poolPower' &&
            poolIndex === poolIndexToRemove
          ) {
            acc.push(poolPowers[poolIndex].powers[powerIndex]);
          }
        }
        return acc;
      },
      []
    );

    const pool = poolPowers[poolIndexToRemove];

    const newState = this._removePowersReturnState(...activePowers);
    newState.build.poolPowers = this.state.build.poolPowers.filter(
      (index) => index !== poolIndexToRemove
    );
    newState.lookup = this._removePoolPreventsFromExclusionReturnLookupState(
      pool.prevents
    );
    this.setState(newState);
  };

  togglePowerSlot = (psIndex) =>
    this.setState({
      ...this.state,
      tracking: {
        ...this.state.tracking,
        powerSlotIndex:
          this.state.tracking.powerSlotIndex === psIndex ? null : psIndex,
      },
    });

  addEnhancement = (powerSlotIndex, enhancement, tier, level = 50) => {
    const addedEnh = this._addEnhancementReturnPowerSlotStateAndEnhLookupState(
      powerSlotIndex,
      enhancement,
      level,
      tier
    );

    if (addedEnh === null) {
      return null;
    }

    const { powerSlots, enhancements, enhancementSlots } = addedEnh;

    this.setState({
      ...this.state,
      build: { ...this.state.build, powerSlots },
      lookup: { ...this.state.lookup, enhancements },
      reference: { ...this.state.reference, enhancementSlots },
    });
  };

  _addEnhancementReturnPowerSlotStateAndEnhLookupState = (
    powerSlotIndex,
    enhancement,
    level,
    tier
  ) => {
    const {
      type,
      displayName,
      fullName,
      isUnique,
      isUniqueInPower,
    } = enhancement;

    let emptySlotIndex = this._getEmptySlotIndex(powerSlotIndex);

    if (
      emptySlotIndex === null &&
      this.powerSlots[powerSlotIndex].enhSlots.length >= 6
    ) {
      return null;
    }

    let powerSlots, enhancementSlots;

    if (emptySlotIndex === null) {
      const newState = this._addPowerSlotReturnSlotAndEnhState(powerSlotIndex);
      powerSlots = newState.powerSlots;
      enhancementSlots = newState.enhancementSlots;
      emptySlotIndex = this._getEmptySlotIndex(powerSlotIndex, powerSlots);
      if (emptySlotIndex === null) {
        return null;
      }
    } else {
      powerSlots = [...this.powerSlots];
      enhancementSlots = [...this.state.reference.enhancementSlots];
    }

    const enhancementLookup = { ...this.state.lookup.enhancements };
    const powerInSlot = this.getPower(powerSlots[powerSlotIndex].power);

    const isAlreadyUsed = enhancementLookup.hasOwnProperty(fullName);
    const isAlreadyInPower =
      isAlreadyUsed &&
      enhancementLookup[fullName].find(
        ({ powerName }) => powerName === powerInSlot.displayName
      );

    if ((isUnique && isAlreadyUsed) || (isUniqueInPower && isAlreadyInPower)) {
      return null;
    }

    powerSlots[powerSlotIndex].enhSlots[emptySlotIndex].enhancement = {
      type,
      displayName,
      fullName,
      level,
      tier,
    };

    if (isAlreadyInPower) {
      isAlreadyInPower.count++;
    } else if (isAlreadyUsed) {
      enhancementLookup[fullName].push({
        powerName: powerInSlot.displayName,
        count: 1,
      });
    } else {
      enhancementLookup[fullName] = [
        { powerName: powerInSlot.displayName, count: 1 },
      ];
    }

    return { powerSlots, enhancements: enhancementLookup, enhancementSlots };
  };

  getEnhancementMag(enhInSlot) {
    const { type, displayName, level, tier } = enhInSlot;

    const tierValue = enhancements[type][displayName].effects.magnitudes[tier];

    return tier === 'IO' ? tierValue[level] : tierValue;
  }

  _getEmptySlotIndex = (psIndex, powerSlots = this.powerSlots) => {
    const ps = powerSlots[psIndex];

    const emptySlotIndex = ps.enhSlots.findIndex(
      ({ enhancement }) => !enhancement
    );

    return emptySlotIndex > -1 ? emptySlotIndex : null;
  };

  _updateState = (e, stateSection) => {
    const specialCases = {
      archetype: true,
      primaryIndex: true,
      secondaryIndex: true,
      poolPower: true,
      epicPoolIndex: true,
    };

    const { name, value } = e.target;

    this.setState(
      specialCases[name]
        ? this._handleSpecialCases(name, value)
        : {
            ...this.state,
            [stateSection]: { ...this.state[stateSection], [name]: value },
          }
    );
  };

  _assignPowerSlotIndex = (powersLevel) => {
    if (powersLevel <= this.activeLevel) {
      // If the user selects a skill that fits into the active slot,
      // use the active slot
      return this.state.tracking.activeLevelIndex;
    }

    // Otherwise, find a slot that is open & >= the skill's level
    const nextAbovePowerSlotIndex = this.state.build.powerSlots.findIndex(
      ({ level, power }) => level >= powersLevel && !power
    );

    return nextAbovePowerSlotIndex > -1 ? nextAbovePowerSlotIndex : null;
  };

  _removeSlotsReturnSlotState = (...slotLevels) => {
    const updatedEnhSlots = [...this.state.reference.enhancementSlots];
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

  _excludePowersetsReturnExcluded = (
    powersetFullNames,
    excludedByDisplayName
  ) => {
    if (!powersetFullNames) {
      return this.state.lookup;
    }

    powersetFullNames = Array.isArray(powersetFullNames)
      ? powersetFullNames
      : [powersetFullNames];
    const excludedPowersets = { ...this.state.lookup.excludedPowersets };
    powersetFullNames.forEach((name) => {
      if (excludedPowersets.hasOwnProperty(name)) {
        excludedPowersets[name].push(excludedByDisplayName);
      } else {
        excludedPowersets[name] = [excludedByDisplayName];
      }
    });

    return excludedPowersets;
  };

  _removePoolPreventsFromExclusionReturnLookupState(prevents) {
    if (!prevents || !prevents.length) {
      return this.state.lookup;
    }

    const excludedPowersets = { ...this.state.lookup.excludedPowersets };
    if (prevents) {
      prevents.forEach((powersetFullName) => {
        if (
          excludedPowersets[powersetFullName] &&
          excludedPowersets[powersetFullName].length === 1
        ) {
          delete excludedPowersets[powersetFullName];
        } else if (excludedPowersets[powersetFullName]) {
          excludedPowersets[powersetFullName] = excludedPowersets[
            powersetFullName
          ].filter((psName) => psName !== powersetFullName);
        } else {
          console.log(
            "Whoops, didn't find ",
            powersetFullName,
            ' in the exclusion list.'
          );
        }
      });
    }

    return { ...this.state.lookup, excludedPowersets };
  }

  _addPowerSlotReturnSlotAndEnhState = (powerSlotIndex) => {
    const powerSlot = this.state.build.powerSlots[powerSlotIndex];
    if (powerSlot.enhSlots.length < 6) {
      const slotIndex = this.state.reference.enhancementSlots.findIndex(
        ({ level, inUse }) => level >= powerSlot.level && !inUse
      );
      if (slotIndex > -1) {
        const slot = this.state.reference.enhancementSlots[slotIndex];
        const powerSlots = this.state.build.powerSlots.map((ps, i) => {
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
        const enhancementSlots = this.state.reference.enhancementSlots.map(
          (s, i) => {
            if (i !== slotIndex) {
              return s;
            }

            return { ...s, inUse: true };
          }
        );
        return { powerSlots, enhancementSlots };
      }
    }
  };

  _togglePowerReturnState = (p, poolIndex) => {
    const isPrimary = p.archetypeOrder === 'primary';
    const { powerIndex } = p;
    const powerLookup = { ...this.state.lookup.powers };
    if (this.buildHasPower(p.fullName)) {
      return this._removePowersReturnState(p);
    } else {
      const isPickingLevel1Power =
        p.level === 1 &&
        ((isPrimary && !this.state.build.powerSlots[0].power) ||
          (!isPrimary && !this.state.build.powerSlots[1].power));

      if (isPickingLevel1Power) {
        const powerSlots = [...this.state.build.powerSlots];
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
          ...this.state,
          build: { ...this.state.build, powerSlots },
          lookup: { ...this.state.lookup, powers: powerLookup },
          tracking: {
            ...this.state.tracking,
            activeLevelIndex: findLowestUnusedSlot(powerSlots),
          },
        };
      } else {
        return addPowerToPowerSlot.call(this);
      }
    }

    function addPowerToPowerSlot(
      powerSlotIndex = this._assignPowerSlotIndex(p.level),
      newPowerIndex = powerIndex,
      archetypeOrder = p.archetypeOrder
    ) {
      if (powerSlotIndex === null) {
        // There are no power slots left that can support the ability
        return;
      }

      const powerSlots = [...this.state.build.powerSlots];
      powerSlots[powerSlotIndex] = {
        ...powerSlots[powerSlotIndex],
        power: { archetypeOrder, powerIndex: newPowerIndex, poolIndex },
        enhSlots: emptyDefaultSlot(),
      };

      return {
        ...this.state,
        build: { ...this.state.build, powerSlots },
        lookup: {
          ...this.state.lookup,
          powers: {
            ...this.state.lookup.powers,
            [p.fullName]: powerSlotIndex,
          },
        },
        tracking: {
          ...this.state.tracking,
          activeLevelIndex: findLowestUnusedSlot(powerSlots),
        },
        // this.state.build.powerSlots[powerSlotIndex].level === this.state.build.activeLevel
        // ? findLowestUnusedSlot(powerSlots)
        // : this.state.build.activeLevel,
      };
    }
  };

  _removePowersReturnState = (...powers) => {
    if (!powers.length) {
      return { ...this.state };
    }
    // Remove power that's been added
    const powerLookup = { ...this.state.lookup.powers };
    const powerSlotIndicesRemoved = powers.reduce((acc, p) => {
      if (powerLookup.hasOwnProperty(p.fullName)) {
        acc[powerLookup[p.fullName]] = true;
        delete powerLookup[p.fullName];
      }

      return acc;
    }, {});
    let lowestPowerSlotIndex;
    let slotsToRemove = [];
    const powerSlots = this.state.build.powerSlots.map((powerSlot, i) => {
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
      if (lowestPowerSlotIndex === undefined) {
        lowestPowerSlotIndex = i;
      }
      return { level, type };
    });

    const enhancementSlots = this._removeSlotsReturnSlotState(...slotsToRemove);

    const activeLevelIndex =
      lowestPowerSlotIndex < this.state.tracking.activeLevelIndex
        ? findLowestUnusedSlot(powerSlots)
        : this.state.tracking.activeLevelIndex;

    return {
      ...this.state,
      build: { ...this.state.build, powerSlots },
      lookup: { ...this.state.lookup, powers: powerLookup },
      tracking: {
        ...this.state.tracking,
        activeLevelIndex,
      },
      reference: { ...this.state.reference, enhancementSlots },
    };
  };

  _handleSpecialCases = (name, value) => {
    switch (name) {
      case 'archetype':
        const initialState = this.constructor.initialState();
        initialState.build.archetype = value;
        initialState.build.origin = this.state.build.origin;
        initialState.build.name = this.state.build.name;
        return initialState;
      case 'primaryIndex':
      case 'secondaryIndex':
      case 'epicPoolIndex':
        const archetypeOrder = name.substring(0, name.length - 5);
        const aoCapital =
          archetypeOrder[0].toUpperCase() + archetypeOrder.substring(1);
        const activeSet = this[`active${aoCapital}`];
        const powersToRemove = this.state.build.powerSlots.reduce(
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
          ...this._removePowersReturnState(...powersToRemove),
          tracking: { ...this.state.tracking, [name]: parseInt(value, 10) },
        };
      // case 'poolPowerIndex':
      //   return {
      //     ...this.state.build,
      //     [name]: poolPowers.find(({ displayName }) => displayName === value),
      //   };
      default:
        return this.state.build;
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
