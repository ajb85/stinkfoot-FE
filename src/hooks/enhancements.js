import useEnhancementNavigation from "providers/builder/useEnhancementNavigation.js";
import usePowerSlots from "providers/builder/usePowerSlots.js";
import useActiveSets from "providers/builder/useActiveSets.js";
import useCharacterDetails from "providers/builder/useCharacterDetails.js";
import {
  getEnhancementSubSections,
  getEnhancementsForPower,
  canEnhancementGoInPowerSlot,
  getBonusesForSet,
  getSetBonusDataForPowerSlot,
} from "helpers/enhancements.js";

import { getEnhancementOverlay } from "helpers/getImages.js";

import { useBuildAnalysis } from "./powersets.js";

export const useGetEnhancementsForPower = () => {
  // getEnhancementSectionForPower
  const { enhNavigation } = useEnhancementNavigation();
  return getEnhancementsForPower(enhNavigation);
};

export const useGetEnhancementSubSections = () => {
  const { enhNavigation } = useEnhancementNavigation();
  return getEnhancementSubSections.bind(this, enhNavigation);
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
  const { enhNavigation } = useEnhancementNavigation();
  const settings = {};

  return getBonusesForSet.bind(this, settings, enhNavigation);
};

export const useAddEnhancement = (powerSlotIndex) => {
  const {
    enhNavigation: { tier },
  } = useEnhancementNavigation();
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

  return (set) =>
    getSetBonusDataForPowerSlot(
      bonuses(set),
      details,
      settings,
      powerSlot,
      set
    );
};
