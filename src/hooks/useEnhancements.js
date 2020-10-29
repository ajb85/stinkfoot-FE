import enhancements from "data/enhancements.js";
import ioSets from "data/ioSets.js";

import useEnhancementNavigation from "providers/builder/useEnhancementNavigation.js";
import { getEnhancementImage } from "helpers/getImages.js";

export const useEnhancementsForPower = (power) => {
  // getEnhancementSectionForPower
  const { enhNavigation } = useEnhancementNavigation();
  const { section, tier, showSuperior } = enhNavigation;
  if (!power.slottable) {
    return [];
  }

  if (section === "standard") {
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
  } else if (section === "sets") {
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
  } else return [];
};

export const useAddEnhancement = (
  powerSlotIndex,
  enhancement,
  enhNavigation,
  level = 50
) => {
  const { tier, showSuperior } = enhNavigation;
  const enhCopy =
    enhancement.type === "set" || enhancement.type === "attuned"
      ? addImageToSetEnhancement(enhancement, tier, showSuperior)
      : { ...enhancement };

  addEnhancements(powerSlotIndex, enhCopy, level, tier);
  // this._setState();
};

export const useAddEnhancementSet = (
  powerSlotIndex,
  { tier, showSuperior },
  ioSetIndex,
  level
) => {
  const ps = this.nextState.build.powerSlots[powerSlotIndex];

  if (ps && ps.enhSlots) {
    removeSlotsFromPower(
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

function addImageToSetEnhancement(enhancement, tier, showSuperior) {
  const enhImages = require.context("./images/enhancements/", true);
  const ioSetIndex = enhancement.setIndex;
  const ioSetImage = ioSets[tier][ioSetIndex].imageName;
  const { isAttuned } = ioSets[tier][ioSetIndex];

  let { imageName } = enhancement;
  if (!imageName && ioSetImage) {
    imageName = ioSetImage;
  } else if (!imageName) {
    throw new Error("No image found for: ", enhancement.displayName);
  }
  // Superior enhancements have an "S" in front of them.  The regular attuned
  // version drops the first letter
  const correctedImgName =
    isAttuned && showSuperior ? "S" + imageName : imageName;

  const enhCopy = { ...enhancement };
  enhCopy.image = enhImages(`./${correctedImgName}`);
  enhCopy.imageName = correctedImgName;

  return enhCopy;
}

function addEnhancements(powerSlotIndex, enhancements, level, tier) {
  if (!Array.isArray(enhancements)) {
    enhancements = [enhancements];
  }

  enhancements.forEach((e) => {
    const { type, displayName, fullName } = e;
    const { imageName, isUnique, setIndex } = e;

    const isSet = type === "set" || type === "attuned";

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
      console.log("UNIQUE ISSUE");
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
      emptySlotIndex = addEnhSlot(powerSlotIndex);
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
  });
}

function removeSlotsFromPower(powerSlotIndex, slotIndices) {
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

    // if (i > 0) {
    //   this._removeSlotsFromRef(slotLevel);
    // }
    return acc;
  }, []);

  // powerSlots[powerSlotIndex].enhSlots = emptyDefaultSlot();

  savedEnhancements.forEach((e) => {
    const { level, tier } = e;

    this._addEnhancements(powerSlotIndex, e, level, tier);
  });
}

function addEnhSlot(powerSlotIndex) {
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
}
