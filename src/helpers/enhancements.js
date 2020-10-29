import enhancements from "data/enhancements.js";
import ioSets, { setTypeConversion } from "data/ioSets.js";
import setBonuses from "data/enhancements/setBonuses.json";
import bonusLibrary from "data/enhancements/bonusesLibrary.json";

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

function _getBonuses(tier, setIndex) {
  const setName = ioSets[tier][setIndex].displayName.split(" ").join("_");
  return setBonuses[setName];
}
