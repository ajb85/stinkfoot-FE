import useEnhancementNavigation from "providers/builder/useEnhancementNavigation.js";
import usePowerSlots from "providers/builder/usePowerSlots.js";
import useCharacterDetails from "providers/builder/useCharacterDetails.js";
import {
  getEnhancementSubSections,
  getEnhancementsForPower,
  canEnhancementGoInPowerSlot,
  getBonusesForSet,
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
  return (enh) => addEnhancement(powerSlotIndex, { ...enh, tier });
};

export const useAddFullSet = (powerSlotIndex) => {
  const {
    enhNavigation: { tier },
  } = useEnhancementNavigation();
  const { addEnhancements } = usePowerSlots();
  return (enhancements) =>
    addEnhancements(
      powerSlotIndex,
      enhancements.map((e) => ({ ...e, tier }))
    );
};

export const useRemoveEnhancement = (powerSlotIndex) => {
  const { removeEnhancement } = usePowerSlots();
  return removeEnhancement.bind(this, powerSlotIndex);
};

export const useGetEnhancementOverlay = () => {
  const { character } = useCharacterDetails();
  return getEnhancementOverlay.bind(this, character.origin);
};
