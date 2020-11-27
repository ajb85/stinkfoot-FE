// @flow
import { Settings, EnhNav, IOSet, BonusLookup } from "flow/types.js";

import enhancements from "data/enhancements.js";
import ioSets, { setTypeConversion } from "data/ioSets.js";
import setBonuses from "data/enhancements/setBonuses.json";
import bonusLibrary from "data/enhancements/bonusesLibrary.json";
import { getEnhancementImage } from "helpers/getImages.js";

export const getBonusesForSet = (
  settings: Settings,
  enhNav: EnhNav,
  set: IOSet
): BonusLookup => {
  const { showSuperior } = enhNav;
  const baseName = set.displayName.split(" ").join("_");
  const isAttuned = setBonuses[baseName] && setBonuses["Superior_" + baseName];
  const correctedSetName =
    showSuperior && isAttuned && !set.noSuperior
      ? "Superior_" + baseName
      : baseName;

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

export const getEnhancementSubSections = ({ section }, types) => {
  const isSet = section === "sets";

  if (isSet) {
    // If IOs, map over the setNums
    return types.map((setType) => ({
      name: setTypeConversion[setType]
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join(""),
      setType,
    }));
  }

  // Else, send back standard IOs
  return ["IO", "SO", "DO", "TO"];
};

export const getEnhancementsForPower = ({ section, setType, showSuperior }) => {
  if (section === "standard") {
    return getStandardEnhancementsForPower;
  } else if (section === "sets") {
    return getIOSetEnhancementsForPower.bind(this, setType, showSuperior);
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
  if (!power.slottable) {
    return [];
  }

  return power.allowedEnhancements.reduce((acc, enhName) => {
    const enh = { ...enhancements.standard[enhName] };
    const { imageName } = enh;
    if (!imageName) {
      console.log("MISSING DATA: ", enhName);
      return acc;
    } else {
      enh.image = getEnhancementImage(imageName);
      acc.push(enh);
      return acc;
    }
  }, []);
}

function getIOSetEnhancementsForPower(setType, showSuperior) {
  if (!ioSets[setType]) {
    return [];
  }

  return ioSets[setType].map((set) => {
    let { imageName } = set;
    if (!imageName) {
      throw new Error("No image found for: ", set.displayName);
    }
    // Superior enhancements have an "s" in front of the name

    const correctedImgName =
      !set.isAttuned || !showSuperior || set.noSuperior
        ? imageName
        : "S" + imageName;
    set.image = getEnhancementImage(correctedImgName);
    set.enhancements.forEach((e) => (e.image = set.image));
    return set;
  });
}
