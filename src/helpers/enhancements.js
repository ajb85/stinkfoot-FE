// @flow
import { Settings, IOSet, BonusLookup } from "flow/types.js";

import enhancements, { mapSetTypeToName } from "data/enhancements.js";
import setBonuses from "data/enhancements/setBonuses.json";
import bonusLibrary from "data/enhancements/bonusesLibrary.json";
import { noFunc } from "js/utility.js";

const { ioSets } = enhancements;

export const getBonusesForSet = (
  settings: Settings,
  set: IOSet
): BonusLookup => {
  const { showSuperior } = settings;
  const baseName = set.displayName.split(" ").join("_");
  const hasSuperior = !!set.superiorImageName;
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

export const getEnhancementSubSections = ((cache) => ({
  navigation,
  setTypes,
}) => {
  const isSet = navigation && navigation.section === "sets";

  if (isSet) {
    if (!cache.has(setTypes)) {
      // If IOs, map over the setNums
      cache.set(
        setTypes,
        setTypes.map((setType) => ({
          name: mapSetTypeToName[setType]
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join(""),
          setType,
        }))
      );
    }

    return cache.get(setTypes);
  }

  // Else, send back standard IOs
  return ["IO", "SO", "DO", "TO"];
})(new Map());

export const getEnhancementsForPowerSlot = (
  { power, navigation },
  { showSuperior }
) => {
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

export const canEnhancementGoInPowerSlot = ({ lookup }, power, enhancement) => {
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
  bonuses,
  { lookup, excluded },
  settings,
  powerSlot,
  set
) {
  const setsInCurrentPower = lookup.setsInPower[powerSlot.power.fullName];
  const setInPower = (setsInCurrentPower &&
    setsInCurrentPower[set.fullName]) || { count: 0 };

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

  /* TEMPORARY TO SOLVE BUG, WILL REMOVE WHEN DATA IS FIXED */
  const allowed = new Set();
  power.allowedEnhancements.forEach((enhName) => {
    if (enhancements.standard[enhName]) {
      allowed.add(enhancements.standard[enhName]);
    }
  });
  /* TEMPORARY TO SOLVE BUG, WILL REMOVE WHEN DATA IS FIXED */

  return Array.from(allowed);
}

function getIOSetEnhancementsForPower(showSuperior, power) {
  if (!power || !power.setTypes) {
    return [];
  }

  return power.setTypes.reduce((acc, setType) => {
    acc[setType] = ioSets[setType];
    return acc;
  }, {});
}
