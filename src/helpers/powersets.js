import powersets from "data/powersets.js";
import poolPowers from "data/poolPowers.js";
import epicPools from "data/epicPools.js";
import { powerSlotIndexLookup } from "data/powerSlotsTemplate.js";

const standardizeOrder = {
  primary: "primaries",
  primaries: "primaries",
  secondary: "secondaries",
  secondaries: "secondaries",
  poolPower: "poolPowers",
  poolPowers: "poolPowers",
  epicPool: "epicPools",
  epicPools: "epicPools",
};

// const pluralToSingleOrder = {
//   primaries: "primary",
//   secondaries: "secondary",
//   poolPowers: "poolPower",
//   epicPools: "epicPool",
// };

export const allPowersets = {
  primaries: powersets,
  secondaries: powersets,
  poolPowers,
  epicPools,
};

export function getPowersets(archetype, archetypeOrder) {
  const atOrder = standardizeOrder[archetypeOrder];
  const allSets = allPowersets[atOrder];
  const notPool = isNotPoolPower(atOrder);

  const powersets = notPool
    ? atOrder === "epicPools"
      ? allSets[archetype] // Epic pool -> Blaster: [set, set, set]
      : allSets[archetype][atOrder] // Primary/Secondary -> Blaster: { primaries: [set, set, set]}
    : allSets; // Pools -> [set, set, set]
  return powersets;
}

export function getSlotIndexFromActiveLevel({ activeLevel }, power) {
  const isPrimary = power.archetypeOrder === "primary";
  return activeLevel === 1
    ? isPrimary
      ? 1
      : 0
    : powerSlotIndexLookup.selected[activeLevel];
}

export function togglePower({ tracking }, archetype, details, psFuncs, power) {
  const { removePowerFromSlot, addPowerToSlot, powerSlots } = psFuncs;
  const { lookup } = details;
  const isRemoving = lookup.powers[power.fullName] !== undefined;

  const isPrimary = power.archetypeOrder === "primary";

  const slotIndex = getSlotIndexFromActiveLevel(tracking, power);
  const activePowerSlot = powerSlots[slotIndex];

  if (!isRemoving && power.level === 1) {
    // Level one powers are more complicated so handling them separate to try to keep the logic
    // organized
    if (isPrimary && !powerSlots[0].power) {
      // When adding a level 1 primary to the build, automatically add the first level 1 secondary power if it isn't added
      const secondary = getPowersets(archetype, "secondary")[
        tracking.secondary
      ];
      addPowerToSlot(secondary.powers[0], 0);
    }

    if (power.archetypeOrder === "secondary") {
      // Force level 1 secondary to go in the first slot
      // (blocks from adding it to a later slot)
      return addPowerToSlot(power, 0);
    } else {
      if (activePowerSlot.level !== 1 && !powerSlots[1].power) {
        // User is adding a level 1 power to a higher level slot without having a skill in level 1, thus auto assign the other
        const otherPowerIndex = power.index === 0 ? 1 : 0;
        const primary = getPowersets(archetype, "primary")[tracking.primary];
        const otherPower = primary.powers[otherPowerIndex];
        addPowerToSlot(otherPower, 1);
      }
    }
  }

  if (isRemoving) {
    removePowerFromSlot(lookup.powers[power.fullName]);
  } else if (tracking.activeLevel >= power.level) {
    addPowerToSlot(power, slotIndex);
  } else {
    const slotIndex = powerSlots.findIndex(
      (ps) => !ps.power && ps.level >= power.level
    );

    addPowerToSlot(power, slotIndex);
  }
}

export function getNextActiveLevel(setTrackingManually, powerSlots) {
  const nextSlot = powerSlots.find(({ power }) => !power);
  const nextLevel = nextSlot ? nextSlot.level : null;
  setTrackingManually("activeLevel", nextLevel);
}

export function arePowerRequirementsMet({ lookup }, power) {
  if (!power.requires) {
    return true;
  }
  const slotIndex = lookup.powers[power.fullName];
  const { powers, count } = power.requires;
  const reqCount = Object.keys(powers).reduce((acc, p) => {
    return lookup.powers[p] !== undefined && lookup.powers[p] < slotIndex
      ? acc + 1
      : acc;
  }, 0);

  return reqCount >= count;
}

export function canPowersetBeAdded({ lookup, excluded }, { fullName }) {
  const isExcluded = excluded.powersets[fullName];
  const isPool = fullName.substring(0, 4) === "Pool";
  const isAlreadyInBuild = isPool && lookup.powersets[fullName];

  return !isAlreadyInBuild && !isExcluded;
}

export function powerSelectionColor({ lookup }, getSlotFromPower, power) {
  const isPoolPower =
    power.archetypeOrder === "poolPower" || power.archetypeOrder === "epicPool";
  const isPowerInUse = lookup.powers[power.fullName] !== undefined;
  const powerSlot = getSlotFromPower(power);
  const areReqsMet = arePowerRequirementsMet({ lookup }, power);

  return isPowerInUse
    ? areReqsMet
      ? "lightgreen"
      : "red"
    : powerSlot.level >= power.level
    ? isPoolPower
      ? areReqsMet
        ? "yellow"
        : "grey"
      : "yellow"
    : "grey";
}

function isNotPoolPower(archetypeOrder) {
  return archetypeOrder !== "poolPower" && archetypeOrder !== "poolPowers";
}
