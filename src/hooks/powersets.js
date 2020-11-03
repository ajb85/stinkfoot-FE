import poolPowers from "data/poolPowers.js";

import useActiveSets from "providers/builder/useActiveSets.js";
import useCharacterDetails from "providers/builder/useCharacterDetails.js";
import usePowerSlots from "providers/builder/usePowerSlots.js";
import usePoolPowers from "providers/builder/usePoolPowers.js";

import {
  getPowersets,
  togglePower,
  arePowerRequirementsMet,
  canPowersetBeAdded,
  powerSelectionColor,
  getNextActiveLevel,
  getSlotIndexFromActiveLevel,
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
  return getPowersets(archetype, archetypeOrder);
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
    primary: useActivePowerset("primary"),
    secondary: useActivePowerset("secondary"),
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
export const useTogglePower = () => {
  const trackingState = useActiveSets();
  const details = useBuildAnalysis();
  const psFuncs = usePowerSlots();
  const { character } = useCharacterDetails();
  return togglePower.bind(
    this,
    trackingState,
    character.archetype,
    details,
    psFuncs
  );
};

export const usePowerSelectionColor = () => {
  const { tracking } = useActiveSets();
  const details = useBuildAnalysis();
  const { powerSlots } = usePowerSlots();
  const getSlotIndex = getSlotIndexFromActiveLevel.bind(this, tracking);
  return powerSelectionColor.bind(
    this,
    details,
    (power) => powerSlots[getSlotIndex(power)]
  );
};

export function useCanPowersetBeAdded() {
  const details = useBuildAnalysis();
  return canPowersetBeAdded.bind(this, details);
}

export const useNextActiveLevel = () => {
  const { powerSlots } = usePowerSlots();
  const { setTrackingManually } = useActiveSets();
  return getNextActiveLevel.bind(this, setTrackingManually, powerSlots);
};

/******************************************
 ******************************************
 ***********  STATE UPDATERS  *************
 ******************************************
 *****************************************/

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
  const activePool = useActivePowerset("poolPower");
  const canPoolBeAdded = useCanPoolBeAdded();
  const firstPool =
    poolPowers.find(
      (pool) => canPoolBeAdded(pool) && pool.poolIndex !== activePool.poolIndex
    ) || {};
  return setTrackingManually.bind(this, "poolPower", firstPool.poolIndex || 0);
}
