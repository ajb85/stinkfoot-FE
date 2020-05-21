import powersets from 'data/powersets.js';
import poolPowers from 'data/poolPowers.js';
import epicPools from 'data/epicPools.js';
import origins from 'data/origins.js';
import archetypes from 'data/archetypes.js';
import powerSlotsTemplate from 'data/powerSlotsTemplate.js';
import enhancementSlots from 'data/enhancementSlots.js';
import enhancements from 'data/enhancements.js';
import ioSets, { setTypeConversion } from 'data/ioSets.js';
import IOSets from 'Planner/PowerSlots/Enhancements/IOSets';

export default class BuildManager {
  constructor(state, setState) {
    this.state = state;
    this.setState = setState;
    console.log('STATE: ', this.state);

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
        setBonuses: {},
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
    const { section, tier, showSuperior } = enhNavigation;
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
      return ioSets[tier].map((enh) => {
        let { imageName } = enh;
        if (!imageName) {
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

  addEnhancement = (
    powerSlotIndex,
    enhancement,
    enhNavigation,
    level = 50,
    bonuses
  ) => {
    const { tier, showSuperior } = enhNavigation;
    const enhCopy =
      enhancement.type === 'set' || enhancement.type === 'attuned'
        ? this._addImageToSetEnhancement(enhancement, tier, showSuperior)
        : { ...enhancement };

    this._addEnhancements(powerSlotIndex, enhCopy, level, tier, bonuses);
    this._setState();
  };

  addFullEnhancementSet = (
    powerSlotIndex,
    { tier, showSuperior },
    ioSetIndex,
    level
  ) => {
    const ps = this.nextState.build.powerSlots[powerSlotIndex];

    if (ps && ps.enhSlots) {
      this._removeSlotsFromPower(
        powerSlotIndex,
        ps.enhSlots.map((_, i) => i)
      );
    }

    this._addEnhancements(
      powerSlotIndex,
      ioSets[tier][ioSetIndex].enhancements.map((e) =>
        this._addImageToSetEnhancement(e, tier, showSuperior)
      ),
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

  shortenEnhName = (name) => {
    const shortened = {
      Accuracy: 'Acc',
      Damage: 'Dmg',
      Defense: 'Def',
      Endurance: 'End',
      'Fly Speed': 'FlySpd',
      Healing: 'Heal',
      'Hit Points': 'HP',
      'Jump Speed': 'JumpSpd',
      Recharge: 'Rech',
      'Run Speed': 'RunSpd',
    };
    return name
      .split('/')
      .map((n) => (shortened[n] ? shortened[n] : n))
      .join('/');
  };

  canEnhancementGoInPowerSlot(enhancement, powerSlotIndex) {
    // With isUnique, type, and fullName, this will return if the
    // enhancement can be added to a slot
    const powerSlot = this.nextState.build.powerSlots[powerSlotIndex];
    const power = this.getPower(powerSlot.power);

    const { isUnique, type, fullName } = enhancement;
    const enhLookup = this.nextState.lookup.enhancements;

    const isUniqueInPower = type === 'set' || type === 'attuned';
    const isInUse = !!enhLookup[fullName];
    const isInPower =
      isInUse &&
      enhLookup[enhancement.fullName].find(
        ({ powerName }) => powerName === power.fullName
      );

    return (
      (isUnique && !isInUse) ||
      (!isUnique && isUniqueInPower && !isInPower) ||
      (!isUnique && !isUniqueInPower)
    );
  }

  getBonusTiersForPowerSlot(powerSlotIndex) {
    const { enhSlots } = this.state.build.powerSlots[powerSlotIndex];

    return enhSlots.reduce((acc, { enhancement }) => {
      if (enhancement) {
        const { setIndex } = enhancement;

        if (setIndex) {
          acc[setIndex] = acc[setIndex] ? ++acc[setIndex] : (acc[setIndex] = 1);
        }
      }

      return acc;
    }, {});
  }

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

  _addImageToSetEnhancement(enhancement, tier, showSuperior) {
    const enhImages = require.context('./images/enhancements/', true);
    const ioSetIndex = enhancement.setIndex;
    const ioSetImage = ioSets[tier][ioSetIndex].imageName;
    const { isAttuned } = ioSets[tier][ioSetIndex];

    let { imageName } = enhancement;
    if (!imageName && ioSetImage) {
      imageName = ioSetImage;
      enhancement.isAttuned = isAttuned;
    } else if (!imageName) {
      throw new Error('No image found for: ', enhancement.displayName);
    }
    // Superior enhancements have an "S" in front of them.  The regular attuned
    // version drops the first letter
    const correctedImgName =
      !enhancement.isAttuned || !showSuperior ? imageName : 'S' + imageName;

    const enhCopy = { ...enhancement };
    enhCopy.image = enhImages(`./${correctedImgName}`);
    enhCopy.imageName = correctedImgName;

    return enhCopy;
  }

  _compressAggData = (bonusAndPvX) => {
    const compressed = [];
    let lastUnlocked;
    const { bonusName, ...pvx } = bonusAndPvX;
    for (let toWho in pvx) {
      const toWhoPath = [toWho];
      const affectedBy = pvx[toWho];
      for (let effectName in affectedBy) {
        const effectPath = [...toWhoPath, effectName];
        const effects = affectedBy[effectName];

        for (let mag in effects) {
          const path = [...effectPath, mag];
          const { display, unlocked /*, color */ } = effects[mag];

          const newItem = { path, display, effectName, unlocked, bonusName };

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

  _addEnhancements = (powerSlotIndex, enhancements, level, tier, bonuses) => {
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

      const isSet = type === 'set' || type === 'attuned';

      const enhancementLookup = this.nextState.lookup.enhancements;

      const { power } = this.nextState.build.powerSlots[powerSlotIndex];
      const powerInSlot = this.getPower(power);

      const isAlreadyUsed = enhancementLookup.hasOwnProperty(fullName);
      const enhLog =
        isAlreadyUsed &&
        enhancementLookup[fullName].find(
          ({ powerName }) => powerName === powerInSlot.displayName
        );

      if ((isUnique && isAlreadyUsed) || (isSet && enhLog)) {
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

      if (enhLog) {
        enhLog.count++;
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

      if (isSet) {
        this._addSetBonuses(powerSlotIndex, tier, setIndex, bonuses);
      }
    });
  };

  findEnhancementIndex(enhancement, powerSlotIndex) {
    const powerSlot = this.nextState.build.powerSlots[powerSlotIndex];

    const { fullName } = enhancement;
    return powerSlot.enhSlots.findIndex(
      ({ enhancement }) => enhancement && enhancement.fullName === fullName
    );
  }

  bonusCanBeAdded = (bonusName) => {
    return (
      !this.state.build.setBonuses.hasOwnProperty(bonusName) ||
      this.state.build.setBonuses[bonusName] < 5
    );
  };

  _addSetBonuses = (powerSlotIndex, tier, setIndex, bonuses) => {
    const { setBonuses } = this.nextState.build;
    const setCount = this.nextState.build.powerSlots[
      powerSlotIndex
    ].enhSlots.reduce(
      (acc, { enhancement }) =>
        enhancement.setIndex === setIndex ? ++acc : acc,
      0
    );

    const bonusAtCount = bonuses.find(({ pve }) =>
      pve[0].find(({ unlocked }) => unlocked === setCount)
    );

    if (bonusAtCount) {
      const bn = bonusAtCount.pve[0][0].bonusName;
      if (setBonuses[bn] && setBonuses[bn] < 5) {
        setBonuses[bn] = ++setBonuses[bn];
      } else {
        setBonuses[bn] = 1;
      }
    }
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

    const { powerSlots } = this.nextState.build;
    const { enhSlots } = powerSlots[powerSlotIndex];

    const savedEnhancements = enhSlots.reduce((acc, enh, i) => {
      const { slotLevel, enhancement } = enh;
      if (!slotIndexLookup[i]) {
        acc.push(enhancement);
      }

      if (enhancement) {
        this._removeEnhancementFromLookup(powerSlotIndex, enhancement.fullName);
      }

      if (i > 0) {
        this._removeSlotsFromRef(slotLevel);
      }
      return acc;
    }, []);

    powerSlots[powerSlotIndex].enhSlots = emptyDefaultSlot();

    savedEnhancements.forEach((e) => {
      const { level, tier } = e;

      this._addEnhancements(powerSlotIndex, e, level, tier);
    });
  }

  _removeEnhancementFromLookup = (powerSlotIndex, enhFullName) => {
    const { powerSlots } = this.nextState.build;

    const enhancementsLookup = this.nextState.lookup.enhancements;

    const { displayName } = this.getPower(powerSlots[powerSlotIndex].power);
    const enhLog = enhancementsLookup[enhFullName];
    if (enhLog.length === 1 && enhLog[0].count === 1) {
      delete enhancementsLookup[enhFullName];
    } else {
      const indexToRemove = enhLog.findIndex(
        (power) => power.powerName === displayName
      );

      enhLog[indexToRemove].count--;

      if (enhLog[indexToRemove].count <= 0) {
        enhancementsLookup[enhFullName] = enhLog.filter(
          (_, i) => i !== indexToRemove
        );
      }
    }
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
