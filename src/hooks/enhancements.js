import useEnhancementNavigation from "providers/builder/useEnhancementNavigation.js";

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

export const useCanEnhancementGoInPowerSlot = (powerSlot) => {
  const details = useBuildAnalysis();
  return canEnhancementGoInPowerSlot.bind(this, details, powerSlot.power);
};

export const useGetBonusesForSet = () => {
  const { enhNavigation } = useEnhancementNavigation();
  const settings = {};

  return getBonusesForSet.bind(this, settings, enhNavigation);
};
