// @flow
import type {
  Settings,
  IOSet,
  Bonus,
  BonusStatsForPower,
  BuildAnalysis,
  Power,
  PowerSlot,
  IOSetLookup,
} from "flow/types.js";

import enhancements, { mapSetTypeToName } from "data/enhancements.js";
import setBonuses from "data/enhancements/setBonuses.json";
import bonusLibrary from "data/enhancements/bonusesLibrary.json";
import { noFunc } from "js/utility.js";
import { getPowerFromRef } from "js/getFromRef.js";

const { ioSets } = enhancements;

export const getBonusesForSet: Function = (
  settings: Settings,
  set: IOSet
): Array<Bonus> => {
  const { showSuperior } = settings;
  const baseName = set.displayName.split(" ").join("_");
  const hasSuperior = !!set.imageNameSuperior;
  const correctedSetName =
    showSuperior && hasSuperior ? "Superior_" + baseName : baseName;

  if (!setBonuses[correctedSetName]) {
    return [];
  }

  const pvpEnabled = settings.pvp;

  return setBonuses[correctedSetName].reduce(
    (acc, { name, unlocked, isPvP }) => {
      if (isPvP && !pvpEnabled) {
        return acc;
      }
      acc.push({ unlocked, isPvP, bonus: bonusLibrary[name] });
      return acc;
    },
    []
  );
};

export const getEnhancementSubSections: Function = ((cache) => (
  archetype,
  { navigation, powerRef }
) => {
  const { power } = getPowerFromRef(archetype, powerRef);
  const isSet = navigation && navigation.section === "sets";

  if (isSet && power && power.setTypes) {
    const { setTypes } = power;
    if (!cache.has(setTypes)) {
      // If IOs, map over the set types
      cache.set(
        setTypes,
        setTypes.map((setType) => ({
          name: mapSetTypeToName[setType].split(" ")[0],
          setType,
        }))
      );
    }

    return cache.get(setTypes);
  }

  // Else, send back standard enhancement
  return [
    { name: "IO", setType: "IO" },
    { name: "SO", setType: "SO" },
    { name: "DO", setType: "DO" },
    { name: "TO", setType: "TO" },
  ];
})(new Map());

export const getEnhancementsForPowerSlot: Function = (
  archetype,
  { powerRef, navigation },
  { showSuperior }
) => {
  const { power } = getPowerFromRef(archetype, powerRef);
  const section = navigation ? navigation.section : "standard";
  if (!power) {
    return noFunc.bind(this, section === "standard" ? [] : {});
  }

  if (section === "standard") {
    return getStandardEnhancementsForPower.bind(this, power);
  } else if (section === "sets") {
    return getIOSetEnhancementsForPower.bind(this, showSuperior, power);
  } else return () => [];
};

export const canEnhancementGoInPowerSlot: Function = (
  { lookup },
  power,
  enhancement
) => {
  // With isUnique, type, and fullName, this will return if the
  // enhancement can be added to a slot
  if (!power) {
    return false;
  }

  const { isUnique, type, fullName } = enhancement;
  const isUniqueInPower = type === "set" || type === "attuned";
  const isInUse = lookup.enhancements[fullName] !== undefined;
  const isInPower = isInUse && lookup.enhancements[fullName][power.fullName];

  return (
    (isUnique && !isInUse) ||
    (!isUnique && isUniqueInPower && !isInPower) ||
    (!isUnique && !isUniqueInPower)
  );
};

export function getSetBonusDataForPowerSlot(
  bonuses: Array<Bonus>,
  buildAnalysis: BuildAnalysis,
  settings: Settings,
  powerSlot: PowerSlot,
  ioSet: IOSet,
  archetype: string
): Array<BonusStatsForPower> {
  if (!powerSlot.powerRef) {
    return [];
  }

  const { lookup } = buildAnalysis;
  const power = getPowerFromRef(archetype, powerSlot.powerRef);
  const setsInCurrentPower = lookup.setsInPower[power.fullName];
  const setInPower = (setsInCurrentPower &&
    setsInCurrentPower[ioSet.fullName]) || { count: 0 };

  const { count } = setInPower;
  return bonuses.map(({ bonus, unlocked }) => ({
    displays: bonus.displays,
    isActive: unlocked <= count,
    bonusCount: lookup.setBonuses[bonus.bonusName] || 0,
  }));
}

function getStandardEnhancementsForPower(power) {
  if (!power || !power.slottable) {
    return [];
  }

  /* TEMPORARY TO SOLVE BUG WITH DUPLICATE DATA, WILL REMOVE WHEN DATA IS FIXED */
  const allowed = new Set();
  power.allowedEnhancements.forEach((enhName) => {
    if (enhancements.standard[enhName]) {
      allowed.add(enhancements.standard[enhName]);
    }
  });
  /* TEMPORARY TO SOLVE BUG WITH DUPLICATE DATA, WILL REMOVE WHEN DATA IS FIXED */

  return { standard: Array.from(allowed) };
}

function getIOSetEnhancementsForPower(
  showSuperior: boolean,
  power: Power
): IOSetLookup {
  if (!power || !power.setTypes) {
    return {};
  }

  return power.setTypes.reduce((acc, setType) => {
    acc[setType] = ioSets[setType];
    return acc;
  }, {});
}
