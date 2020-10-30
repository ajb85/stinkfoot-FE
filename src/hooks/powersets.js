import poolPowers from "data/poolPowers.js";

import useActiveSets from "providers/builder/useActiveSets.js";
import useCharacterDetails from "providers/builder/useCharacterDetails.js";
import usePowerSlots from "providers/builder/usePowerSlots.js";
import usePoolPowers from "providers/builder/usePoolPowers.js";
import useEnhNav from "providers/builder/useEnhancementNavigation.js";

import { getPowerset, getPower } from "helpers/powersets.js";
import analyzeBuild from "helpers/analyzeBuild.js";

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

export function useSelectedPoolNames() {
  const { pools } = usePoolPowers();
  return pools.map((i) => poolPowers[i].displayName);
}

export function usePower({ archetypeOrder, powerIndex, poolIndex }) {
  const { character } = useCharacterDetails();
  const { archetype } = character;
  return getPower({ archetypeOrder, powerIndex, poolIndex }, archetype);
}

export function useSubSectionForPowerType(types) {
  // getSubSectionsForPower
  if (!Array.isArray(types)) {
    types = [types];
  }

  const {
    enhNavigation: { tier },
  } = useEnhNav();

  if (!isNaN(parseInt(tier, 10))) {
    // If IOs, map over the setNums
    return types.map((setNum) => {
      return {
        tier: setNum,
        name: setTypeConversion[setNum],
        isSet: true,
      };
    });
  }

  // Else, send back standard IOs
  return ["IO", "SO", "DO", "TO"].map((name) => ({
    tier: name,
    name,
    isSet: false,
  }));
}

export function useIsPowersetExcluded(powersetFullName) {}

export function useBuildHasPower() {}

export function useBuildHasPool(poolFullName) {}

export function usePoolCanBeAdded(poolFullName) {}

export function usePowerFromNewPool(power) {
  const pool = useActivePowerset("poolPower");
  const isExcluded = useIsPowersetExcluded(pool.fullName);
  const selectedPools = useSelectedPoolNames();

  const { poolIndex } = power;
  const poolCanBeAdded =
    selectedPools.length < 4 &&
    selectedPools.indexOf(poolIndex) === -1 &&
    !isExcluded;

  if (!poolCanBeAdded) {
    return;
  }

  selectedPools.push(poolIndex);
  this._togglePower(power);

  // Find a pool that hasn't been excluded & isn't active
  this.nextState.tracking.poolPowerIndex = poolPowers.findIndex(
    ({ fullName }, i) =>
      !this.isPowersetExcluded(fullName) && selectedPools.indexOf(i) === -1
  );

  // Update exclusion list with any sets this one prevents & itself (no double adding)
  excludePowersets(pool.prevents, pool.displayName);
  this._setState();
}

export const useRemovePool = (poolIndexToRemove) => {
  // const { pools, removePools } = usePoolPowers();
  const { powerSlots } = usePowerSlots();
  powerSlots.forEach((powerSlot) => {
    if (powerSlot.power) {
      const { power } = powerSlot;
      if (
        power.archetypeOrder === "poolPower" &&
        power.poolIndex === poolIndexToRemove
      ) {
        // this._removePowers(this.getPower(power));
      }
    }
  });
};

export const useSelectedPools = () => {
  const { pools } = usePoolPowers();
  const poolData = [];

  for (let i = 0; i < pools.length; i++) {
    poolData.push(poolPowers[i]);
  }

  return poolDat;
};

export const useBuildAnalysis = () => {
  const { character } = useCharacterDetails();
  const { powerSlots } = usePowerSlots();
  const activePowersets = {
    primary: useActivePowerset("primaries"),
    secondary: useActivePowerset("secondaries"),
    pools: useSelectedPools(),
  };

  return analyzeBuild(powerSlots, character.archetype, activePowersets);
};

export const useTogglePower = (power) => {
  const { tracking } = useActiveSets();
  const details = useBuildAnalysis();
  const { lookup } = details;
  const { removePowerFromSlot, addPowerToSlot } = usePowerSlots();

  const isRemoving = lookup.powers[power.fullName] !== undefined;

  if (isRemoving) {
    removePowerFromSlot(lookup.powers[power.fullName]);
  } else if (canPowerGoInSlot(power, tracking.activeLevel, details)) {
    addPowerToSlot();
  }
};

export const useCanPowerGoInSlot = (power) => {
  const { tracking } = useActiveSets();
  const details = useBuildAnalysis();
  return canPowerGoInSlot(power, tracking.activeLevel, details);
};

export function canPowerGoInSlot(power, activeLevel, { lookup }) {
  const hasRequirements = power.requirements;

  if (hasRequirements) {
    const { powers, count } = power.requirements;

    const reqCount = Object.keys(powers).reduce(
      (acc, p) => (lookup.powers[p] !== undefined ? acc + 1 : acc),
      0
    );

    if (reqCount < count) {
      return false;
    }
  }

  return power.level <= activeLevel;
}
