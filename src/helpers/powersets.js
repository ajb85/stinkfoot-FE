import powersets from "data/powersets.js";
import poolPowers from "data/poolPowers.js";
import epicPools from "data/epicPools.js";

export const allPowersets = {
  primary: powersets,
  primaries: powersets,
  secondary: powersets,
  secondaries: powersets,
  poolPower: poolPowers,
  poolPowers,
  epicPool: epicPools,
  epicPools,
};

function isNotPoolPower(archetypeOrder) {
  return archetypeOrder !== "poolPower" && archetypeOrder !== "poolPowers";
}

export function getPowerset({ archetypeOrder }, archetype) {
  const allSets = allPowersets[archetypeOrder];
  const powersets = isNotPoolPower(archetypeOrder)
    ? allSets[archetype]
    : allSets;
  return powersets;
}

export function getPower(archetype, { archetypeOrder, powerIndex, poolIndex }) {
  const powerset = getPowerset({ archetypeOrder }, archetype);
  const ps = poolIndex !== undefined ? powerset[poolIndex] : powerset;
  return ps.powers[powerIndex];
}

export function togglePower(tracking, details, powerslots, power, index) {
  const { removePowerFromSlot, addPowerToSlot } = powerslots;
  const { lookup } = details;
  const isRemoving = lookup.powers[power.fullName] !== undefined;

  if (isRemoving) {
    removePowerFromSlot(lookup.powers[power.fullName]);
  } else if (canPowerGoInSlot(power, tracking.activeLevel, details)) {
    addPowerToSlot(power, index);
  }
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
  const isAlreadyInBuild = lookup.powersets[fullName];
  return !isExcluded && !isAlreadyInBuild;
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
