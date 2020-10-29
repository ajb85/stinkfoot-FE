// import powersets from "data/powersets.js";
// import poolPowers from "data/poolPowers.js";
// import epicPools from "data/epicPools.js";
// import origins from "data/origins.js";
// import archetypes from "data/archetypes.js";
// import powerSlotsTemplate from "data/powerSlotsTemplate.js";
// import enhancementSlots from "data/enhancementSlots.js";
// import enhancements from "data/enhancements.js";
// import ioSets, { setTypeConversion } from "data/ioSets.js";
// import setBonuses from "data/enhancements/setBonuses.json";
// import bonusLibrary from "data/enhancements/bonusesLibrary.json";

// export default class BuildManager {
//   constructor(state, setState) {
//     this.state = state;
//     this.setState = setState;
//     console.log("STATE: ", this.state);

//     // State to be mutated and eventually set as new state
//     // ** replace with immer
//     this.nextState = this._deepCloneState();

//     this.lookup = this.state.build.powerSlots.reduce(
//       (acc, { enhSlots, power }, i) => {
//         const p = power && this.getPower(power);
//         if (p) {
//           acc.powers[p.fullName] = i;
//         }

//         const hasEnhs = enhSlots && enhSlots.length;
//         hasEnhs && scanEnhancementsForLookup(acc, p, enhSlots);

//         return acc;
//       },
//       {
//         powers: {},
//         enhancements: {},
//         uniqueEnhancements: {},
//       }
//     );

//     const primaryPrevents = this.activePrimary.prevents || [];
//     const secondaryPrevents = this.activeSecondary.prevents || [];
//     const poolsPrevent = this.state.build.poolPowers.map((index) => {
//       const pool = this.pools[index];
//       if (pool.prevents) {
//         pool.prevents.name = pool.displayName;
//       }
//       return pool.prevents || [];
//     });

//     this.lookup.excludedPowersets = this.combinePrevents(
//       primaryPrevents,
//       secondaryPrevents,
//       poolsPrevent
//     );
