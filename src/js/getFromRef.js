import enhancements from "data/enhancements.js";
import powersets from "data/powersets.js";
import poolPowers from "data/poolPowers.js";
import { standardizeNameToPlural } from "js/utility.js";

export function getEnhancementFromRef(ref) {
  const {
    tier,
    type,
    standardIndex,
    setIndex,
    setType,
    setEnhancementIndex,
    fullName,
  } = ref || {};

  let enhancement;
  let newIndex = null;
  if (type === "standard") {
    // { tier, type, standardIndex, fullName }
    enhancement = enhancements.standard[standardIndex];

    if (!enhancement || enhancement.fullName !== fullName) {
      enhancement = enhancements.standard.find(findLostEnhancement);
    }
  } else if (type === "ioSet") {
    // { tier, type, setIndex, setType, fullName, setEnhancementIndex }
    const eExists =
      enhancements.ioSets[setType] &&
      enhancements.ioSets[setType][setIndex] &&
      enhancements.ioSets[setType][setIndex].enhancements[
        setEnhancementIndex
      ] !== undefined;

    enhancement =
      eExists &&
      enhancements.ioSets[setType][setIndex].enhancements[setEnhancementIndex];

    if (!enhancement || enhancement.fullName !== fullName) {
      console.log("NEED ENHANCEMENT IO SET NAME");
      // fullName: Boosts.Attuned_Adjusted_Targeting_A.Attuned_Adjusted_Targeting_A
      const set_name = fullName.split(".")[1]; // set name with underscores
      const setFullName =
        "IOSet." +
        set_name
          .split("_")
          .slice(1, set_name.length - 1)
          .join("_"); // -> doesn't work with Scrapper's Strike and such.  Will have to update data to pull set full name as well
      const set = enhancements.ioSets.find((e) => e.fullName === setFullName);
      enhancement = set.enhancements.find(findLostEnhancement);
    }
  } else {
    console.log(
      "UNKNOWN ENHANCEMENT TYPE: ",
      type,
      tier,
      standardIndex,
      setIndex,
      setType,
      fullName
    );
    enhancement = null;
    newIndex = -1;
  }

  return { enhancement, newIndex };

  function findLostEnhancement(e, i) {
    const isSame = e.fullName === fullName;
    if (isSame) {
      newIndex = i;
    }

    return isSame;
  }
}

export function getPowerFromRef(archetype, ref) {
  const {
    archetypeOrder,
    fullName,
    powerIndex,
    poolIndex,
    powersetIndex,
  } = ref;
  const isPoolPower = poolIndex !== undefined;

  let power;
  let mustUpdate = false;
  if (isPoolPower) {
    console.log("is pool power");
    power = poolPowers[poolIndex][powerIndex];

    if (!power || power.fullName !== fullName) {
      mustUpdate = true;
      power = poolPowers[poolIndex].find((p) => p.fullName === fullName);

      if (!power) {
        console.log("NEED POOL NAME");
      }
    }
  } else {
    const atOrder = standardizeNameToPlural(archetypeOrder);
    console.log("IS NOT POOL POWER");
    const pExists =
      powersets[archetype] &&
      powersets[archetype][atOrder] &&
      powersets[archetype][atOrder][powersetIndex] &&
      powersets[archetype][atOrder][powersetIndex].powers[powerIndex];
    console.log(archetype, atOrder, powersetIndex, powerIndex);
    console.log(powersets);

    if (pExists) {
      console.log("POWER EXISTS");
      power = powersets[archetype][atOrder][powersetIndex].powers[powerIndex];

      if (power.fullName !== fullName) {
        console.log("NAMES DO NOT MATCH", power.fullName, fullName);
        mustUpdate = true;

        // Did power move to a different index?
        power = powersets[archetype][atOrder].find(
          (p) => p.fullName === fullName
        );

        if (!power) {
          console.log("NO POWER IN SET");
          // Power is no longer in the set
          power = null;
        }
      }
    } else {
      // No power was found, something went wrong
      console.log("NO POWER BY REF");
      power = null;
    }
  }

  return { power, mustUpdate };
}
