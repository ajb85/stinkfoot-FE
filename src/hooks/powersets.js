import poolPowers from "data/poolPowers.js";

import useActiveSets from "providers/builder/useActiveSets.js";
import useCharacterDetails from "providers/builder/useCharacterDetails.js";
import usePowerSlots from "providers/builder/usePowerSlots.js";
import usePoolPowers from "providers/builder/usePoolPowers.js";

import {
  getPowersets,
  togglePower,
  canPowersetBeAdded,
  powerSelectionColor,
  getNextActiveLevel,
  getSlotIndexFromActiveLevel,
} from "hooks/helpers/powersets.js";

import { getPowerFromRef } from "js/getFromRef.js";
import { useGetBonusesForSet } from "hooks/enhancements.js";

import analyzeBuild from "hooks/helpers/analyzeBuild.js";

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
  const { powerSlots } = usePowerSlots();
  const activePowersets = {
    primary: useActivePowerset("primary"),
    secondary: useActivePowerset("secondary"),
    pools: useSelectedPools(),
  };
  const getBonusesForSet = useGetBonusesForSet();

  return analyzeBuild(powerSlots, activePowersets, getBonusesForSet);
};

export const usePowerFromRef = (ref) => {
  const { character } = useCharacterDetails();
  if (!ref) {
    return null;
  }

  const { power, mustUpdate } = getPowerFromRef(character.archetype, ref);

  if (!power || mustUpdate) {
    // update build, something changed
  }

  return power;
};

/******************************************
 ******************************************
 *********  FUNCTION RETRIEVERS  **********
 ******************************************
 *****************************************/
export const useTogglePowerSlot = (index) => {
  const { tracking, setTrackingManually } = useActiveSets();
  const toggled = tracking.toggledSlot;
  const value = index === toggled ? null : index;
  return setTrackingManually.bind(this, "toggledSlot", value);
};

export const useRemoveSlotToggles = () => {
  const { clearToggles } = useActiveSets();
  return clearToggles;
};

export const useActiveEnhancementSet = () => {
  const { tracking, setTrackingManually } = useActiveSets();
  const toggleActiveEnhancementSet = (i) =>
    setTrackingManually("toggledSet", i === tracking.toggledSet ? null : i);
  const { toggledSet } = tracking;

  return { toggledEnhancementSet: toggledSet, toggleActiveEnhancementSet };
};

export const useClearActiveEnhancementSet = () => {
  const { setTrackingManually } = useActiveSets();
  return setTrackingManually.bind(this, "toggledSet", null);
};

export const useResetBuild = () => {
  const { resetPowerSlots } = usePowerSlots();
  const { resetPools } = usePoolPowers();

  return () => {
    resetPowerSlots();
    resetPools();
  };
};

export const useSwitchArchetype = () => {
  const { setCharacterDetail, character } = useCharacterDetails();
  const resetBuild = useResetBuild();
  return (e) => {
    if (e.target.value !== character.archetype) {
      setCharacterDetail(e);
      resetBuild();
    }
  };
};

export const useChangePowerset = () => {
  const { powerSlots, removePowerFromSlot, addPowerToSlot } = usePowerSlots();
  const { tracking, setActiveTracking } = useActiveSets();
  const secondaries = usePowersets("secondaries");

  return (e) => {
    const { name, value } = e.target;
    // console.log("CHANGING: ", name, value, s)
    if (value === tracking[name]) {
      return;
    }

    powerSlots.forEach(
      ({ power }, i) =>
        power &&
        e.target.name === power.archetypeOrder &&
        removePowerFromSlot(i)
    );
    setActiveTracking(e);
    if (e.target.name === "secondary" && !!powerSlots[0].power) {
      // Replace first power if it's been selected
      addPowerToSlot(secondaries[e.target.value].powers[0], 0);
    }
  };
};

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
  const getSlotFromPower = (power) => powerSlots[getSlotIndex(power)];
  return powerSelectionColor.bind(this, details, getSlotFromPower);
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
    poolData.push(poolPowers[pools[i]]);
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
  const { addPool } = usePoolPowers();

  return (power) => {
    if (canBeAdded) {
      const { poolIndex } = pool;
      addPool(poolIndex);
      togglePower(power);
    }
  };
}

export function useRemovePool() {
  const { powerSlots, removePowerFromSlot } = usePowerSlots();
  const { removePool } = usePoolPowers();
  return (poolIndex) => {
    powerSlots.forEach(({ power }, i) => {
      if (power && power.poolIndex === poolIndex) {
        removePowerFromSlot(i);
      }
    });
    removePool(poolIndex);
  };
}
