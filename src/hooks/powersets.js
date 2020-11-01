import poolPowers from "data/poolPowers.js";

import useActiveSets from "providers/builder/useActiveSets.js";
import useCharacterDetails from "providers/builder/useCharacterDetails.js";
import usePowerSlots from "providers/builder/usePowerSlots.js";
import usePoolPowers from "providers/builder/usePoolPowers.js";

import {
  getPowerset,
  getPower,
  togglePower,
  canPowerGoInSlot,
  canPowersetBeAdded,
  powerSelectionColor,
} from "helpers/powersets.js";

import { useGetBonusesForSet } from "hooks/enhancements.js";

import analyzeBuild from "helpers/analyzeBuild.js";

/******************************************
 ******************************************
 ***********  DATA RETRIEVAL  *************
 ******************************************
 *****************************************/
export function usePowersets(archetypeOrder) {
  const { character } = useCharacterDetails();
  const { archetype } = character;
  return getPowerset({ archetypeOrder }, archetype);
}

export function useActivePowerset(archetypeOrder) {
  const { tracking } = useActiveSets();
  const activeIndex = tracking[archetypeOrder];
  return usePowersets(archetypeOrder)[activeIndex];
}

export function useBuildHasPower(power) {
  const { lookup } = useBuildAnalysis();
  return lookup.powers[power.fullName] !== undefined;
}

export const useBuildAnalysis = () => {
  const { character } = useCharacterDetails();
  const { powerSlots } = usePowerSlots();
  const activePowersets = {
    primary: useActivePowerset("primaries"),
    secondary: useActivePowerset("secondaries"),
    pools: useSelectedPools(),
  };
  const getBonusesForSet = useGetBonusesForSet();

  return analyzeBuild(
    powerSlots,
    character.archetype,
    activePowersets,
    getBonusesForSet
  );
};

/******************************************
 ******************************************
 *********  FUNCTION RETRIEVERS  **********
 ******************************************
 *****************************************/
export function useGetPower() {
  const { character } = useCharacterDetails();
  const { archetype } = character;
  return getPower.bind(this, archetype);
}

export const useTogglePower = () => {
  const { tracking } = useActiveSets();
  const details = useBuildAnalysis();
  const psFuncs = usePowerSlots();
  return togglePower.bind(this, tracking, details, psFuncs);
};

export const useCanPowerGoInSlot = () => {
  const { tracking } = useActiveSets();
  const details = useBuildAnalysis();
  return canPowerGoInSlot.bind(this, tracking.activeLevel, details);
};

export const usePowerSelectionColor = () => {
  const { tracking } = useActiveSets();
  const details = useBuildAnalysis();
  return powerSelectionColor.bind(this, tracking.activeLevel, details);
};

export function useCanPowersetBeAdded() {
  const analysis = useBuildAnalysis();
  return canPowersetBeAdded.bind(this, analysis);
}

/******************************************
 ******************************************
 *************  POOL POWERS  **************
 ******************************************
 *****************************************/
export function useBuildHasPool(poolIndex) {
  const { pools } = usePoolPowers();
  return !!pools.find((p) => p.poolIndex === poolIndex);
}

export function useSelectedPoolNames() {
  const { pools } = usePoolPowers();
  const poolData = [];

  for (let i = 0; i < pools.length; i++) {
    poolData.push(poolPowers[i].displayName);
  }

  return poolData;
}

export const useSelectedPools = () => {
  const { pools } = usePoolPowers();
  const poolData = [];

  for (let i = 0; i < pools.length; i++) {
    poolData.push(poolPowers[i]);
  }

  return poolData;
};

export function useCanPoolBeAdded() {
  const canPoolBeAdded = useCanPowersetBeAdded();
  const selectedPools = useSelectedPoolNames();

  return (pool) => canPoolBeAdded(pool) && selectedPools.length < 4;
}

export function useAddPowerFromNewPool() {
  const pool = useActivePowerset("poolPower");
  const canBeAdded = useCanPoolBeAdded()(pool);
  const togglePower = useTogglePower();
  const updateTracking = useFirstUnusedPool();
  const { addPool } = usePoolPowers();
  return (power) => {
    if (canBeAdded) {
      const { poolIndex } = power;
      addPool(poolIndex);
      togglePower(power);
      updateTracking();
    }
  };
}

export function useFirstUnusedPool() {
  const { setTrackingManually } = useActiveSets();
  const canPoolBeAdded = useCanPoolBeAdded();
  const firstPool = poolPowers.find((pool) => canPoolBeAdded(pool)) || {};
  return setTrackingManually.bind(this, "poolPower", firstPool.poolIndex || 0);
}
