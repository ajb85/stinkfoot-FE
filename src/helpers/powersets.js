import powersets from "data/powersets.js";
import poolPowers from "data/poolPowers.js";
import epicPools from "data/epicPools.js";

export const allPowersets = {
  primary: powersets,
  secondary: powersets,
  poolPower: poolPowers,
  epicPool: epicPools,
};

export function getPowerset({ archetypeOrder }, archetype) {
  const allSets = allPowersets[archetypeOrder];
  const powersets =
    archetypeOrder !== "poolPower" ? allSets[archetype] : allSets;
  return powersets;
}

export function getPower({ archetypeOrder, powerIndex, poolIndex }, archetype) {
  const powerset = getPowerset({ archetypeOrder }, archetype);
  const ps = poolIndex !== undefined ? powerset[poolIndex] : powerset;
  return ps.powers[powerIndex];
}

// export const combinePrevents = (
//   primaryPrevents,
//   secondaryPrevents,
//   poolsPrevents
// ) => {
//   const priName = this.activePrimary.displayName;
//   const secName = this.activeSecondary.displayName;

//   primaryPrevents.name = priName;
//   secondaryPrevents.name = secName;
//   const preventByPools = poolsPrevents.reduce(
//     (acc, preventList, i) => ({
//       ...acc,
//       ...preventList.reduce(toNameValue, {}),
//     }),
//     {}
//   );

//   return {
//     ...primaryPrevents.reduce(toNameValue, {}),
//     ...secondaryPrevents.reduce(toNameValue, {}),
//     ...preventByPools,
//   };
// };
