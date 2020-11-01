import enhancements from "data/enhancements.js";
import ioSets from "data/ioSets.js";
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

export const getDisplayBonuses = (setName, { showSuperior }, settings = {}) => {
  const baseName = setName.split(" ").join("_");
  const isAttuned = setBonuses[baseName] && setBonuses["Superior_" + baseName];
  const correctedSetName =
    showSuperior && isAttuned ? "Superior_" + baseName : baseName;

  if (!setBonuses[correctedSetName]) {
    console.log("NO BONUSES FOR ", correctedSetName);
    return [];
  }

  const pvpEnabled = settings.pvp;

  return setBonuses[correctedSetName].reduce(
    (acc, { name, unlocked, isPvP }) => {
      if (isPvP && !pvpEnabled) {
        return acc;
      }
      // const {effects, ...bonus} = bonusLibrary[name];
      acc.push({
        unlocked,
        isPvP,
        displays: bonusLibrary[name].displays,
        bonusName: name,
      });
      return acc;
    },
    []
  );
};

export const getBonusTiersForPowerSlot = ({ enhSlots }) => {
  return enhSlots.reduce((acc, { enhancement }) => {
    if (enhancement) {
      const { setIndex } = enhancement;

      if (setIndex) {
        acc[setIndex] = acc[setIndex] ? ++acc[setIndex] : (acc[setIndex] = 1);
      }
    }

    return acc;
  }, {});
};

export const getBonusCount = (bonusName, powerSlots) => {
  let bonusCount = 0;
  const psLength = powerSlots.length;
  for (let i = 0; i < psLength; i++) {
    const ps = powerSlots[i];
    if (!ps.enhSlots) {
      continue;
    }
    const enhLength = ps.enhSlots.length;

    let enhCount = {};
    for (let j = 0; j < enhLength; j++) {
      const enh = ps.enhSlots[j].enhancement;
      if (!enh || (enh.type !== "set" && enh.type !== "attuned")) {
        continue;
      }
      const key = `${enh.tier},${enh.setIndex}`;
      enhCount[key] = enhCount[key] ? ++enhCount[key] : 1;
    }

    for (let enh in enhCount) {
      const bonusTier = enhCount[enh];
      const [tier, setIndex] = enh.split(",");
      const bonuses = _getBonuses(tier, setIndex);
      const bonusLength = bonuses.length;

      for (let k = 0; k < bonusLength; k++) {
        const b = bonuses[k];

        if (b.unlocked > bonusTier) {
          break;
        }
        if (b.name === bonusName) {
          bonusCount++;
        }
      }
    }
  }
  return bonusCount;
};

export const getEnhancementSubSections = ({ tier }, types) => {
  const isSet = !isNaN(parseInt(tier, 10));
  if (isSet) {
    // If IOs, map over the setNums
    return types.map((setNum) => ({
      tier: setNum,
      name: [setNum],
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

export const getEnhancementsForPower = (section, tier, showSuperior) => {
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

function _getBonuses(tier, setIndex) {
  const setName = ioSets[tier][setIndex].displayName.split(" ").join("_");
  return setBonuses[setName];
}
