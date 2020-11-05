import useEnhancementNavigation from "providers/builder/useEnhancementNavigation.js";
import usePowerSlots from "providers/builder/usePowerSlots.js";
import {
  getEnhancementSubSections,
  getEnhancementsForPower,
  canEnhancementGoInPowerSlot,
  getBonusesForSet,
} from "helpers/enhancements.js";

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
