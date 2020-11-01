import useEnhancementNavigation from "providers/builder/useEnhancementNavigation.js";

import {
  getEnhancementSubSections,
  getEnhancementsForPower,
  canEnhancementGoInPowerSlot,
  getBonusesForSet,
} from "helpers/enhancements.js";

import { useBuildAnalysis, useGetPower } from "./powersets.js";

export const useGetEnhancementsForPower = () => {
  // getEnhancementSectionForPower
  const { enhNavigation } = useEnhancementNavigation();
  const { section, tier, showSuperior } = enhNavigation;
  return getEnhancementsForPower(section, tier, showSuperior);
};

export const useGetEnhancementSubSections = () => {
  const { enhNavigation } = useEnhancementNavigation();
  return getEnhancementSubSections.bind(this, enhNavigation);
};

export const useCanEnhancementGoInPowerSlot = (powerSlot) => {
  const details = useBuildAnalysis();
  const getPower = useGetPower();

  return canEnhancementGoInPowerSlot.bind(
    this,
    details,
    getPower(powerSlot.power)
  );
};

export const useGetBonusesForSet = () => {
  const { enhNavigation } = useEnhancementNavigation();
  const settings = {};

  return getBonusesForSet.bind(this, settings, enhNavigation);
};
