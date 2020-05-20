import powersets from 'data/powersets.js';
import poolPowers from 'data/poolPowers.js';
import epicPools from 'data/epicPools.js';
import origins from 'data/origins.js';
import archetypes from 'data/archetypes.js';
import powerSlotsTemplate from 'data/powerSlotsTemplate.js';
import enhancementSlots from 'data/enhancementSlots.js';
import enhancements from 'data/enhancements.js';
import ioSets, { setTypeConversion } from 'data/ioSets.js';

export default class BuildManager {
  constructor(state, setState) {
    this.state = state;
    this.setState = setState;
    // console.log('STATE: ', this.state);

    // State to be mutated and eventually set as new state
    this.nextState = this._deepCloneState();
  }

  static initialState() {
    return {
      build: {
        name: '',
        archetype: archetypes[0],
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
        uniqueEnhancements: {},
      },
      reference: { enhancementSlots },
      settings: { pvp: false },
    };
  }

  get primaries() {
    return powersets[this.state.build.archetype].primaries;
  }

  get activePrimary() {
    const {
      build: { archetype },
      tracking: { primaryIndex },
    } = this.state;

    return powersets[archetype].primaries[primaryIndex];
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

  get tracking() {
    return this.state.tracking;
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

  getSetting(name) {
    return this.state.settings[name];
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

  getEnhancementSectionForPower = (power, enhNavigation) => {
    const { section, tier, ioSetIndex, showSuperior } = enhNavigation;
    const enhImages = require.context('./images/enhancements/', true);
    if (!power.slottable) {
      return [];
    }

    if (section === 'standard') {
      return power.allowedEnhancements.reduce((acc, enhName) => {
        const enh = { ...enhancements.standard[enhName] };
        const { imageName } = enh;
        if (!imageName) {
          console.log('MISSING DATA: ', enhName);
          return acc;
        } else {
          enh.image = enhImages(`./${imageName}`);
          acc.push(enh);
          return acc;
        }
      }, []);
    } else if (section === 'sets') {
      const mapOver =
        ioSetIndex === null
          ? ioSets[tier]
          : ioSets[tier][ioSetIndex].enhancements;

      const ioSetImage =
        ioSetIndex !== null ? ioSets[tier][ioSetIndex].imageName : null;
      const { isAttuned } = ioSetIndex !== null ? ioSets[tier][ioSetIndex] : {};

      const mapped = mapOver.map((enh) => {
        let { imageName } = enh;
        if (!imageName && ioSetImage) {
          imageName = ioSetImage;
          enh.isAttuned = isAttuned;
        } else if (!imageName) {
          throw new Error('No image found for: ', enh.displayName);
        }
        // Superior enhancements have an "S" in front of them.  The regular attuned
        // version drops the first letter
        const correctedImgName =
          !enh.isAttuned || showSuperior ? imageName : imageName.substring(1);
        enh.image = enhImages(`./${correctedImgName}`);

        enh.imageName = correctedImgName;
        return enh;
      });
      return ioSetIndex === null
        ? mapped
        : { ...ioSets[tier][ioSets], enhancements: mapped };
    } else return [];
  };

  getEnhancementAndOverlayImages = (powerSlotEnhData) => {
    const { imageName, tier, type } = powerSlotEnhData;
    const enhImages = require.context('./images/enhancements/', true);

    const enhancement = enhImages(`./${imageName}`);
    let overlay;
    if (type === 'standard') {
      overlay = this.getEnhancementOverlay(tier);
    } else if (type === 'set') {
      overlay = this.getEnhancementOverlay('IO');
    }

    return {
      enhancement,
      overlay,
    };
  };

  getEnhancementOverlay = (tier) => {
    const images = require.context('./images/overlays/', true);
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
    const oImages = require.context('./images/origins/', true);
    return oImages(`./${originName}.png`);
  };

  getArchetypeImage = (atName) => {
    const atImages = require.context('./images/archetypes/', true);
    return atImages('./' + atName.split(' ').join('_') + '.png');
  };

  getPowersetImage = (imageName) => {
    if (!imageName) {
      return null;
    }

    imageName = imageName.imageName ? imageName.imageName : imageName;

    const images = require.context('./images/powersets/', true);
    return images(`./${imageName}`);
  };

  getSubSectionsForIOSets = (types) => {
    if (!Array.isArray(types)) {
      types = [types];
    }
    return types.map((setNum) => {
      return {
        tier: setNum,
        name: setTypeConversion[setNum],
      };
    });
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

  getEnhancement = (data) => {
    const enhancementTypes = {
      standard: ({ fullName, tier, level }) => {
        const enhStat = fullName.split('_').slice(1).join('_');
        const enh = { ...enhancements.standard[enhStat] };
        const stats =
          tier === 'IO' ? enh.effects[tier][level] : enh.effects[tier];
        enh.effects = stats;
        return enh;
      },
      ioSet: ({ tier, setIndex, fullName }) => {
        const { enhancements, ...setInfo } = { ...ioSets[tier][setIndex] };
        const enhancement = enhancements.find((e) => e.fullName === fullName);
        enhancement.set = setInfo;
        return enhancement;
      },
    };

    if (data.type) {
      // Is enhancement
      const enhType =
        data.type === 'set' || data.type === 'attuned' ? 'ioSet' : data.type;
      return enhancementTypes[enhType](data);
    } else {
      return null;
    }
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

  togglePower = (p) => {
    this._togglePower(p);
    this._setState();
  };

  addSlot = (powerSlotIndex) => {
    this._addEnhSlot(powerSlotIndex);
    this._setState();
  };

  removeSlots = (powerSlotIndex, slotIndices) => {
    this._removeSlotsFromPower(powerSlotIndex, slotIndices);
    this._setState();
  };

  addPowerFromNewPool = (p) => {
    const pool = this.activePool;
    const { poolIndex } = p;
    const { poolPowers: pps } = this.nextState.build;
    const poolCanBeAdded =
      pps.length < 4 &&
      pps.indexOf(poolIndex) === -1 &&
      !this.isPowersetExcluded(pool.fullName);

    if (!poolCanBeAdded) {
      return;
    }

    pps.push(poolIndex);
    this._togglePower(p);

    // Find a pool that hasn't been excluded & isn't active
    this.nextState.tracking.poolPowerIndex = poolPowers.findIndex(
      ({ fullName }, i) =>
        !this.isPowersetExcluded(fullName) && pps.indexOf(i) === -1
    );

    // Update exclusion list with any sets this one prevents & itself (no double adding)
    this._excludePowersets(pool.prevents, pool.displayName);
    this._setState();
  };

  removePool = (poolIndexToRemove) => {
    this.nextState.build.powerSlots.forEach((powerSlot) => {
      if (powerSlot.power) {
        const { power } = powerSlot;
        if (
          power.archetypeOrder === 'poolPower' &&
          power.poolIndex === poolIndexToRemove
        ) {
          this._removePowers(this.getPower(power));
        }
      }
    });

    this.nextState.build.poolPowers = this.nextState.build.poolPowers.filter(
      (index) => index !== poolIndexToRemove
    );

    this._removePoolPreventsFromExclusion(
      poolPowers[poolIndexToRemove].prevents
    );
    this._setState();
  };

  togglePowerSlot = (psIndex) => {
    const nextIndex =
      this.state.tracking.powerSlotIndex === psIndex ? null : psIndex;
    this.nextState.tracking.powerSlotIndex = nextIndex;
    this._setState();
  };

  addEnhancement = (powerSlotIndex, enhancement, { tier }, level = 50) => {
    this._addEnhancements(powerSlotIndex, enhancement, level, tier);
    this._setState();
  };

  addFullEnhancementSet = (powerSlotIndex, { tier, ioSetIndex }, level) => {
    const ps = this.nextState.build.powerSlots[powerSlotIndex];

    if (ps && ps.enhSlots) {
      this._removeSlotsFromPower(
        powerSlotIndex,
        ps.enhSlots.map((_, i) => i)
      );
    }
    this._addEnhancements(
      powerSlotIndex,
      ioSets[tier][ioSetIndex].enhancements,
      level ? level : ioSets[tier][ioSetIndex].levels.max,
      tier
    );

    this._setState();
  };

  getEnhancementMag = (enhInSlot) => {
    // const { type, displayName, level, tier } = enhInSlot;
    // const tierValue = enhancements[type][displayName].effects.magnitudes[tier];
    // return tier === 'IO' ? tierValue[level] : tierValue;
  };

  convertSetBonuses = (bonuses) => {
    return bonuses.map(({ pve, pvp }) => ({
      pve: this._compressAggData(pve),
      pvp: this._compressAggData(pvp),
    }));
  };

  // getBonusText(text, color) {
  //   const startIndices = this._indexOfAll(text, '{');
  //   const endIndices = this._indexOfAll(text, '}');

  //   if ((!startIndices && !endIndices) || !color) {
  //     return [{ text }];
  //   }

  //   if (
  //     startIndices &&
  //     endIndices &&
  //     startIndices.length === endIndices.length
  //   ) {
  //     const textWithColor = [];
  //     for (let i = 0; i < startIndices.length; i++) {
  //       const colorStart = startIndices[i] + 1;
  //       const colorEnd = endIndices[i];
  //       const noColorStart = i === 0 ? 0 : endIndices[i - 1] + 1;

  //       // First push text between colors
  //       textWithColor.push({
  //         text: text.substring(noColorStart, colorStart - 1),
  //       });
  //       // Then push the text with color
  //       textWithColor.push({
  //         color,
  //         text: text.substring(colorStart, colorEnd),
  //       });
  //     }

  //     // Once loop has ended, add any remaining text
  //     const endText = {
  //       text: text.substring(endIndices[endIndices.length - 1] + 1),
  //     };
  //     if (endText) {
  //       textWithColor.push(endText);
  //     }

  //     return textWithColor;
  //   } else {
  //     throw new Error('Mismatched brackets in bonus color text');
  //   }
  // }

  _indexOfAll(text, target) {
    const indices = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === target) {
        indices.push(i);
      }
    }

    return indices.length ? indices : null;
  }

  _compressAggData = (pvx) => {
    const compressed = [];
    let lastUnlocked;
    for (let toWho in pvx) {
      const toWhoPath = [toWho];
      const affectedBy = pvx[toWho];

      for (let effectName in affectedBy) {
        const effectPath = [...toWhoPath, effectName];
        const effects = affectedBy[effectName];

        for (let mag in effects) {
          const path = [...effectPath, mag];
          const { display, unlocked /*, color */ } = effects[mag];

          const newItem = { path, display, effectName, unlocked };
          // if (color) {
          //   newItem.color = color;
          // }

          if (lastUnlocked === unlocked) {
            compressed[compressed.length - 1].push(newItem);
          } else {
            lastUnlocked = unlocked;
            compressed.push([newItem]);
          }
        }
      }
    }

    return compressed;
  };

  _setState = () => {
    // Individual methods mutate the state copy
    // This method updates the state once they are done
    this.setState(this.nextState);
  };

  _deepCloneState = (data = this.state) => {
    if (this._isObject(data)) {
      const clone = { ...data };

      for (let key in clone) {
        if (clone[key] !== undefined) {
          clone[key] = this._deepCloneState(clone[key]);
        } //else return clone[key];
      }

      return clone;
    } else if (Array.isArray(data)) {
      return [...data].map((d) => this._deepCloneState(d));
    }

    return data;
  };

  _getEmptySlotIndex = (psIndex) => {
    const { powerSlots } = this.nextState.build;
    const ps = powerSlots[psIndex];
    const emptySlotIndex = ps.enhSlots.findIndex(
      ({ enhancement }) => !enhancement
    );

    return emptySlotIndex > -1 ? emptySlotIndex : null;
  };

  _addEnhancements = (powerSlotIndex, enhancements, level, tier) => {
    if (!Array.isArray(enhancements)) {
      enhancements = [enhancements];
    }

    enhancements.forEach((enhancement) => {
      const {
        type,
        displayName,
        fullName,
        imageName,
        isUnique,
        setIndex,
      } = enhancement;

      const isUniqueInPower = type === 'set' || type === 'attuned';

      const enhancementLookup = this.nextState.lookup.enhancements;

      const { power } = this.nextState.build.powerSlots[powerSlotIndex];
      const powerInSlot = this.getPower(power);

      const isAlreadyUsed = enhancementLookup.hasOwnProperty(fullName);
      const isAlreadyInPower =
        isAlreadyUsed &&
        enhancementLookup[fullName].find(
          ({ powerName }) => powerName === powerInSlot.displayName
        );

      if (
        (isUnique && isAlreadyUsed) ||
        (isUniqueInPower && isAlreadyInPower)
      ) {
        console.log('UNIQUE ISSUE');
        return;
      }

      let emptySlotIndex = this._getEmptySlotIndex(powerSlotIndex);

      if (
        emptySlotIndex === null &&
        this.nextState.build.powerSlots[powerSlotIndex].enhSlots.length >= 6
      ) {
        // No open slot & no room for another
        return;
      }

      if (emptySlotIndex === null) {
        // No empty slot but there is room for one
        emptySlotIndex = this._addEnhSlot(powerSlotIndex);
      }

      // There is an empty slot (whether it was just added or already existed)
      this.nextState.build.powerSlots[powerSlotIndex].enhSlots[
        emptySlotIndex
      ].enhancement = {
        type,
        displayName,
        imageName,
        fullName,
        level,
        tier,
        setIndex,
      };

      if (isAlreadyInPower) {
        // isAlreadyInPower is actually the enhancement inside of lookup,
        // it's just truthy if it exists
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
    });
  };

  _removeSlotsFromPower(powerSlotIndex, slotIndices) {
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

    const enhancementsLookup = this.nextState.lookup.enhancements;
    const { powerSlots } = this.nextState.build;
    const { enhSlots } = powerSlots[powerSlotIndex];

    let slideEnhancements = false;
    const slid = {};
    powerSlots[powerSlotIndex].enhSlots = enhSlots.reduce((acc, enh, i) => {
      const { slotLevel, enhancement } = enh;
      if (i > 0 && slotIndexLookup[i]) {
        this._removeSlotsFromRef(slotLevel);
      } else if (i === 0 && slotIndexLookup[i]) {
        // Removing the default slot
        const length = enhSlots.length;
        if (length > 1 && slotIndices.length < length) {
          // If there are more slots than default, shift enhancements down
          // Skip if we are removing all slots
          slideEnhancements = true;
        } else {
          // Or if it's alone, just set it back to an empty slot
          enh = { slotLevel: null };
        }
      }

      if (slotIndexLookup[i] && enhancement) {
        const { displayName } = this.getPower(powerSlots[powerSlotIndex].power);

        if (
          enhancementsLookup[enhancement.fullName].length === 1 &&
          enhancementsLookup[enhancement.fullName][0].count === 1
        ) {
          delete enhancementsLookup[enhancement.fullName];
        } else {
          const indexToRemove = enhancementsLookup[
            enhancement.fullName
          ].findIndex((power) => power.powerName === displayName);
          enhancementsLookup[enhancement.fullName][indexToRemove].count--;
        }
      }

      if (!slotIndexLookup[i] || i === 0) {
        // Only push enhancement slot into acc if not removing it
        if (slideEnhancements) {
          // If slideEnhancements was set to true,
          // look for the next enhancement that isn't going to be deleted
          const nextEnhancementIndex = enhSlots.findIndex(
            (_, j) => !slotIndexLookup[j] && !slid[j]
          );

          if (nextEnhancementIndex > -1) {
            // If found, set its enhancement value to the current slot,
            // otherwise, exclude this slot
            slid[nextEnhancementIndex] = true;
            acc.push({
              ...enh,
              enhancement: enhSlots[nextEnhancementIndex].enhancement,
            });
          }
        } else {
          // If not sliding enhancements, just push the current value
          acc.push(enh);
        }
      }

      return acc;
    }, []);
  }

  _updateState = (e, stateSection) => {
    const specialCases = {
      archetype: true,
      primaryIndex: true,
      secondaryIndex: true,
      poolPower: true,
      epicPoolIndex: true,
    };

    const { name, value } = e.target;

    if (specialCases[name]) {
      this._handleSpecialCases(name, value);
    } else {
      this.nextState[stateSection][name] = value;
    }

    this._setState();
  };

  _assignPowerSlotIndex = (powersLevel) => {
    if (powersLevel <= this.activeLevel) {
      // If the user selects a skill that fits into the active slot,
      // use the active slot
      return this.nextState.tracking.activeLevelIndex;
    }

    // Otherwise, find a slot that is open & >= the skill's level
    const nextAbovePowerSlotIndex = this.nextState.build.powerSlots.findIndex(
      ({ level, power }) => level >= powersLevel && !power
    );

    return nextAbovePowerSlotIndex > -1 ? nextAbovePowerSlotIndex : null;
  };

  _removeSlotsFromRef = (...slotLevels) => {
    const updatedEnhSlots = this.nextState.reference.enhancementSlots;
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
  };

  _excludePowersets = (powersetFullNames, excludedBy) => {
    if (!powersetFullNames || !excludedBy) {
      return;
    }

    powersetFullNames = Array.isArray(powersetFullNames)
      ? powersetFullNames
      : [powersetFullNames];

    const { excludedPowersets } = this.nextState.lookup;

    powersetFullNames.forEach((name) => {
      if (excludedPowersets.hasOwnProperty(name)) {
        excludedPowersets[name].push(excludedBy);
      } else {
        excludedPowersets[name] = [excludedBy];
      }
    });
  };

  _removePoolPreventsFromExclusion(prevents) {
    if (!prevents || !prevents.length) {
      return;
    }

    const { excludedPowersets } = this.nextState.lookup;
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
  }

  _addEnhSlot = (powerSlotIndex) => {
    const powerSlot = this.nextState.build.powerSlots[powerSlotIndex];
    if (powerSlot.enhSlots.length < 6) {
      const slotIndex = this.nextState.reference.enhancementSlots.findIndex(
        ({ level, inUse }) => level >= powerSlot.level && !inUse
      );
      if (slotIndex > -1) {
        const { level: slotLevel } = this.nextState.reference.enhancementSlots[
          slotIndex
        ];
        // Add new slot
        powerSlot.enhSlots.push({ slotLevel });
        // Sort slots by level
        powerSlot.enhSlots.sort((a, b) => a.slotLevel - b.slotLevel);

        this.nextState.reference.enhancementSlots[slotIndex].inUse = true;

        return powerSlot.enhSlots.length - 1;
      }
    }
    return null;
  };

  _togglePower = (p) => {
    const isPrimary = p.archetypeOrder === 'primary';
    const { powerIndex } = p;
    const powerLookup = this.nextState.lookup.powers;
    if (this.buildHasPower(p.fullName)) {
      // If removing the power, simply do that and return;
      this._removePowers(p);
    } else {
      const isPickingLevel1Power =
        p.level === 1 &&
        ((isPrimary && !this.state.build.powerSlots[0].power) ||
          (!isPrimary && !this.state.build.powerSlots[1].power));

      const powerSlots = this.nextState.build.powerSlots;
      if (isPickingLevel1Power) {
        // Level 1 behavior is different from any other power slots (since there are 2 of them).
        // User can pick from one of two primary abilities and is locked in to the first secondary.
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

        this.nextState.tracking.activeLevelIndex = findLowestUnusedSlot(
          powerSlots
        );
      } else {
        // Adding to a slot above level 1
        const powerSlotIndex = this._assignPowerSlotIndex(p.level);
        powerSlots[powerSlotIndex] = {
          ...powerSlots[powerSlotIndex],
          power: {
            archetypeOrder: p.archetypeOrder,
            powerIndex: powerIndex,
            poolIndex: p.poolIndex,
          },
          enhSlots: emptyDefaultSlot(),
        };

        powerLookup[p.fullName] = powerSlotIndex;
        this.nextState.tracking = {
          ...this.nextState.tracking,
          activeLevelIndex: findLowestUnusedSlot(powerSlots),
          powerSlotIndex: null,
        };
      }
    }
  };

  _addPowerToSlot = (p, psIndex) => {
    const { powerSlots } = this.nextState.build;
    const powersLookup = this.nextState.lookup.powers;
    if (
      !powerSlots[psIndex].hasOwnProperty('power') &&
      p.level <= powerSlots[psIndex].level &&
      !powersLookup.hasOwnProperty(p.fullName)
    ) {
      // Only adjust slot if there isn't currently a power there
      // And its level is less than or equal to the current slot level
      const { archetypeOrder, powerIndex, poolIndex } = p;
      powerSlots[psIndex].power = { archetypeOrder, powerIndex, poolIndex };
      powerSlots[psIndex].enhSlots = emptyDefaultSlot();
      powersLookup[p.fullName] = psIndex;
    }
  };

  _removePowers = (...powers) => {
    if (!powers || !powers.length) {
      return;
    }
    // Remove power that's been added
    const powerLookup = this.nextState.lookup.powers;
    const powerSlotIndicesRemoved = powers.reduce((acc, p) => {
      if (powerLookup.hasOwnProperty(p.fullName)) {
        acc[powerLookup[p.fullName]] = true;
        delete powerLookup[p.fullName];
      }

      return acc;
    }, {});
    let lowestPowerSlotIndex;

    this.nextState.build.powerSlots = this.nextState.build.powerSlots.map(
      (powerSlot, i) => {
        if (
          !powerSlotIndicesRemoved.hasOwnProperty(i) ||
          powerSlot.type === 'default'
        ) {
          // If this is not a power slot we're removing or if the power is default,
          // do nothing
          return powerSlot;
        }

        const { level, type, enhSlots } = powerSlot;

        // Otherwise, remove all existing slots
        // Index 0 is ignored since it's attached to the power slot
        this._removeSlotsFromRef(
          ...enhSlots.slice(1).map(({ slotLevel }) => slotLevel)
        );

        if (lowestPowerSlotIndex === undefined) {
          // Record the first power removed to set it as the active Index next state
          lowestPowerSlotIndex = i;
        }
        return { level, type };
      }
    );

    this.nextState.tracking.activeLevelIndex =
      lowestPowerSlotIndex < this.nextState.tracking.activeLevelIndex
        ? findLowestUnusedSlot(this.nextState.build.powerSlots)
        : this.nextState.tracking.activeLevelIndex;
  };

  _handleSpecialCases = (name, value) => {
    switch (name) {
      case 'archetype':
        this.nextState = this.constructor.initialState();
        this.nextState.build.archetype = value;
        this.nextState.build.origin = this.state.build.origin;
        this.nextState.build.name = this.state.build.name;
        break;
      case 'primaryIndex':
      case 'secondaryIndex':
      case 'epicPoolIndex':
        const archetypeOrder = name.substring(0, name.length - 5);

        this._removePowers(
          ...this.state.build.powerSlots.reduce((acc, powerSlot) => {
            // Remove all powers that belong to the archetypeOrder in question
            if (
              powerSlot.power &&
              powerSlot.power.archetypeOrder === archetypeOrder
            ) {
              acc.push(this.getPower(powerSlot.power));
            }
            return acc;
          }, [])
        );

        this.nextState.tracking[name] = parseInt(value, 10);
        break;
      default:
        return;
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

  _isObject = (obj) =>
    typeof obj === 'object' && obj !== null && !Array.isArray(obj);
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
