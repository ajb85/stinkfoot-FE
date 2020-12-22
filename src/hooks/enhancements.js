import usePowerSlots from "providers/builder/usePowerSlots.js";
import useActiveSets from "providers/builder/useActiveSets.js";
import useCharacterDetails from "providers/builder/useCharacterDetails.js";
import {
  getEnhancementSubSections,
  getEnhancementsForPowerSlot,
  canEnhancementGoInPowerSlot,
  getBonusesForSet,
  getSetBonusDataForPowerSlot,
} from "hooks/helpers/enhancements.js";

import { getEnhancementOverlay } from "js/getImage.js";
import { getEnhancementFromRef } from "js/getFromRef.js";

import { useBuildAnalysis } from "./powersets.js";

export const useGetEnhancementsForPowerSlot = (powerSlotIndex) => {
  const { powerSlots } = usePowerSlots();
  const powerSlot = powerSlots[powerSlotIndex];
  const settings = {};
  return getEnhancementsForPowerSlot(powerSlot, settings);
};

export const useGetEnhancementSubSections = (powerSlotIndex) => {
  const { powerSlots } = usePowerSlots();
  const powerSlot = powerSlots[powerSlotIndex];
  // const settings = {};
  return getEnhancementSubSections.bind(this, powerSlot);
};

export const useCanEnhancementGoInPowerSlot = (powerSlotIndex) => {
  const details = useBuildAnalysis();
  const { powerSlots } = usePowerSlots();
  return canEnhancementGoInPowerSlot.bind(
    this,
    details,
    powerSlots[powerSlotIndex].power
  );
};

export const useGetBonusesForSet = () => {
  const settings = {};

  return getBonusesForSet.bind(this, settings);
};

export const useAddEnhancement = (powerSlotIndex) => {
  const { powerSlots } = usePowerSlots();
  const { navigation } = powerSlots[powerSlotIndex].navigation;
  const tier = navigation ? navigation.tier : "IO";
  const { addEnhancement } = usePowerSlots();
  return (enh) =>
    addEnhancement(powerSlotIndex, {
      ...enh,
      tier: enh.type === "attuned" ? "attuned" : tier,
    });
};

export const useAddFullSet = (powerSlotIndex) => {
  const { AddMultiEnhancements } = usePowerSlots();
  const { setTrackingManually } = useActiveSets();
  return (enhancements) => {
    AddMultiEnhancements(
      powerSlotIndex,
      enhancements.map((e) => ({ ...e, tier: "IO" }))
    );
    setTrackingManually("toggledSet", null);
  };
};

export const useRemoveEnhancement = (powerSlotIndex) => {
  const { removeEnhancement } = usePowerSlots();
  return removeEnhancement.bind(this, powerSlotIndex);
};

export const useGetEnhancementOverlay = () => {
  const { character } = useCharacterDetails();
  return getEnhancementOverlay.bind(this, character.origin);
};

export const useGetSetBonusDataForPowerSlot = (powerSlot) => {
  const bonuses = useGetBonusesForSet();
  const details = useBuildAnalysis();
  const settings = {};

  return (ioSet) =>
    getSetBonusDataForPowerSlot(
      bonuses(ioSet),
      details,
      settings,
      powerSlot,
      ioSet
    );
};

export const useEnhancementFromRef = (ref) => {
  if (!ref) {
    return null;
  }

  const { enhancement, newIndex } = getEnhancementFromRef(ref);

  if (!enhancement || newIndex !== null) {
    // update build, something changed
  }

  return enhancement;
};
