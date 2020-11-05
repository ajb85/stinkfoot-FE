import enhancements from "data/enhancements.js";
import ioSets, { setTypeConversion } from "data/ioSets.js";
import setBonuses from "data/enhancements/setBonuses.json";
import bonusLibrary from "data/enhancements/bonusesLibrary.json";
import { getEnhancementImage } from "helpers/getImages.js";

const getEnhancementFromType = {
  standard: ({ fullName, tier, level }) => {
    const enhStat = fullName.split("_").slice(1).join("_");
    const enh = { ...enhancements.standard[enhStat] };
    const stats = tier === "IO" ? enh.effects[tier][level] : enh.effects[tier];
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

export const getEnhancement = (enhDetails) => {
  if (enhDetails.type) {
    // Is enhancement
    const enhType =
      enhDetails.type === "set" || enhDetails.type === "attuned"
        ? "ioSet"
        : enhDetails.type;
    return getEnhancementFromType[enhType](enhDetails);
  } else {
    return null;
  }
};

export const getSetDisplayName = (tier, setIndex) => {
  return ioSets[tier][setIndex].displayName;
};

export const getBonusesForSet = (settings, { showSuperior }, set) => {
  const baseName = set.displayName.split(" ").join("_");
  const isAttuned = setBonuses[baseName] && setBonuses["Superior_" + baseName];
  const correctedSetName =
    showSuperior && isAttuned ? "Superior_" + baseName : baseName;

  if (!setBonuses[correctedSetName]) {
    console.log("NO BONUSES FOR ", correctedSetName, set);
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

export const getBonusesForCount = (set, count) => {
  const setName = set.displayName.split(" ").join("_");
  return setBonuses[setName].slice(0, count - 1);
};

export const getEnhancementSubSections = ({ tier }, types) => {
  const isSet = !isNaN(parseInt(tier, 10));
  if (isSet) {
    // If IOs, map over the setNums
    return types.map((setNum) => ({
      tier: setNum,
      name: setTypeConversion[setNum],
      isSet,
    }));
  }

  // Else, send back standard IOs
  return ["IO", "SO", "DO", "TO"].map((name) => ({
    tier: name,
    name,
    isSet: false,
  }));
};

export const getEnhancementsForPower = ({ section, tier, showSuperior }) => {
  if (section === "standard") {
    return getStandardEnhancementsForPower;
  } else if (section === "sets") {
    return getIOSetEnhancementsForPower.bind(this, tier, showSuperior);
  } else return () => [];
};

export const getIOSet = (setIndex) => ioSets[setIndex];

export const canEnhancementGoInPowerSlot = ({ lookup }, power, enhancement) => {
  // With isUnique, type, and fullName, this will return if the
  // enhancement can be added to a slot
  if (!power) {
    return false;
  }

  const { isUnique, type, fullName } = enhancement;

  const isUniqueInPower = type === "set" || type === "attuned";
  const isInUse = lookup.enhancements[fullName] !== undefined;
  const isInPower =
    isInUse &&
    lookup.enhancements[enhancement.fullName].find(
      ({ powerName }) => powerName === power.fullName
    );

  return (
    (isUnique && !isInUse) ||
    (!isUnique && isUniqueInPower && !isInPower) ||
    (!isUnique && !isUniqueInPower)
  );
};

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

function getIOSetEnhancementsForPower(tier, showSuperior, power) {
  if (!power.slottable) {
    return [];
  }

  return ioSets[tier].map((enh) => {
    let { imageName } = enh;
    if (!imageName) {
      throw new Error("No image found for: ", enh.displayName);
    }
    // Superior enhancements have an "S" in front of them.  The regular attuned
    // version drops the first letter
    const correctedImgName =
      !enh.isAttuned || showSuperior ? imageName : imageName.substring(1);
    enh.image = getEnhancementImage(correctedImgName);

    enh.imageName = correctedImgName;
    return enh;
  });
}
