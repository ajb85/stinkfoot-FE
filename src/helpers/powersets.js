import powersets from "data/powersets.js";
import poolPowers from "data/poolPowers.js";
import epicPools from "data/epicPools.js";

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

const pluralToSingleOrder = {
  primaries: "primary",
  secondaries: "secondary",
  poolPowers: "poolPower",
  epicPools: "epicPool",
};

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

export function togglePower(trackingFuncs, details, psFuncs, power, index) {
  const { tracking, setTrackingManually } = trackingFuncs;
  const { removePowerFromSlot, addPowerToSlot, powerSlots } = psFuncs;
  const { lookup } = details;
  const isRemoving = lookup.powers[power.fullName] !== undefined;

  let updatedPowerSlotState;
  if (isRemoving) {
    updatedPowerSlotState = removePowerFromSlot(lookup.powers[power.fullName]);
  } else if (canPowerGoInSlot(tracking.activeLevel, details, power)) {
    updatedPowerSlotState = addPowerToSlot(power, index);
  } else {
    const slotIndex = powerSlots.findIndex(
      (ps) => !ps.power && ps.level >= power.level
    );

    updatedPowerSlotState = addPowerToSlot(power, slotIndex);
  }

  if (updatedPowerSlotState) {
    setTrackingManually(
      "activeLevel",
      getNextActiveLevel(updatedPowerSlotState)
    );
  }
}

function getNextActiveLevel(powerSlots) {
  const nextSlot = powerSlots.find(({ power }) => !power);
  return nextSlot ? nextSlot.level : null;
}

export function canPowerGoInSlot(activeLevel, { lookup }, power) {
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

export function canPowersetBeAdded({ lookup, excluded }, { fullName }) {
  const isExcluded = excluded.powersets[fullName];
  // const isAlreadyInBuild = lookup.powersets[fullName];
  if (isExcluded) {
    console.log("FULL NAME: ", fullName);
    console.log("IS EXCLUDED: ", isExcluded);
    // console.log("IS ALREADY IN BUILD: ", isAlreadyInBuild);
    // console.log("CAN ADD POWERSET? ", !isExcluded && !isAlreadyInBuild);
  }
  return !isExcluded;
}

export function powerSelectionColor(activeLevel, { lookup }, p) {
  const isPoolPower =
    p.archetypeOrder === "poolPower" || p.archetypeOrder === "epicPool";
  const isPowerInUse = lookup.powers[p.fullName] !== undefined;
  const areReqsMet = canPowerGoInSlot(activeLevel, { lookup }, p);

  return isPowerInUse
    ? areReqsMet
      ? "lightgreen"
      : "red"
    : activeLevel >= p.level
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
