// @flow

import enhancements from "data/enhancements.js";
import { getPowerFromRef, getEnhancementFromRef } from "js/getFromRef.js";
import type { PowerSlot, BuildAnalysis, ActivePowersets } from "flow/types.js";
const { ioSets } = enhancements;

type CacheType = {
  build: Array<PowerSlot>,
  results: BuildAnalysis,
};

function analyzerWrapper(cache: CacheType) {
  return function analyzer(
    powerSlots: Array<PowerSlot>,
    activeSets: ActivePowersets,
    getBonusesForSet: Function,
    archetype: string
  ): BuildAnalysis {
    if (cache.build === powerSlots) {
      return cache.results;
    }

    const results = powerSlots.reduce(
      getSlotReducer(getBonusesForSet, archetype),
      getInitialAcc()
    );

    evaluatePowersets(activeSets, results);

    cache.build = powerSlots;
    cache.results = results;

    return results;
  };
}

const analyzer: Function = analyzerWrapper({});
export default analyzer;

function getSlotReducer(
  getBonusesForSet: Function,
  archetype: string
): Function {
  const setBonusesCache = {};

  return function reduceSlot(
    acc: BuildAnalysis,
    powerSlot: PowerSlot,
    i
  ): BuildAnalysis {
    const { enhSlots, powerRef } = powerSlot;
    // Save power in look up
    if (powerRef && enhSlots) {
      const { power } = getPowerFromRef(archetype, powerRef);
      acc.lookup.powers[power.fullName] = i;

      enhSlots.forEach(({ enhancementRef }) => {
        if (!enhancementRef) {
          return;
        }

        const { enhancement } = getEnhancementFromRef(enhancementRef);
        if (!enhancement) {
          return;
        }

        const isSet = enhancement.setType !== undefined;
        if (isSet) {
          // Save set bonus records
          const set = ioSets[enhancement.setType][enhancement.setIndex];
          if (!acc.lookup.setsInPower[power.fullName]) {
            acc.lookup.setsInPower[power.fullName] = {};
          }

          if (!acc.lookup.setsInPower[power.fullName][set.fullName]) {
            acc.lookup.setsInPower[power.fullName][set.fullName] = {
              count: 1,
              set,
            };
          } else {
            acc.lookup.setsInPower[power.fullName][set.fullName].count++;
          }
        }

        if (enhancement.isUnique) {
          // Save enhancements in look up
          // Record any existing unique enhancements
          acc.excluded.enhancements[enhancement.fullName] = true;
        }

        if (!acc.lookup.enhancements[enhancement.fullName]) {
          // If enhancement is new, setup initial state
          acc.lookup.enhancements[enhancement.fullName] = {};
        }

        const record = acc.lookup.enhancements[enhancement.fullName];
        const recordOfEnh = record[power.fullName];

        if (recordOfEnh) {
          // Increment its count if power is already added for this enhancement
          recordOfEnh.count++;
          recordOfEnh.powerSlotIndices.push(i);
        } else {
          // Create the record for a new power for this enhancement
          record[power.fullName] = {
            powerDisplayName: power.displayName,
            powerSlotIndices: [i],
            count: 1,
          };
        }
      });
      // Tally set bonuses
      const powerBonuses = acc.lookup.setsInPower[power.fullName];

      if (powerBonuses) {
        Object.keys(powerBonuses).forEach((setName) => {
          const { set, count } = powerBonuses[setName];
          if (!setBonusesCache[set.fullName]) {
            setBonusesCache[set.fullName] = getBonusesForSet(set);
          }

          const setBonuses = setBonusesCache[set.fullName];
          setBonuses.slice(0, count - 1).forEach(({ bonus }) => {
            const { bonusName } = bonus;
            // Should consider PvP ?
            const { setBonuses } = acc.lookup;
            setBonuses[bonusName] = setBonuses[bonusName]
              ? setBonuses[bonusName] + 1
              : 1;
          });
        });
      }
      return acc;
    }
    return acc;
  };
}

function getInitialAcc(): BuildAnalysis {
  return {
    lookup: {
      powers: {},
      powersets: {},
      enhancements: {},
      setBonuses: {},
      setsInPower: {},
    },
    excluded: { powers: {}, powersets: {}, enhancements: {} },
  };
}

function evaluatePowersets(
  activeSets: ActivePowersets,
  results
): BuildAnalysis {
  const { primary, secondary, pools } = activeSets;
  // Record active sets
  results.lookup.powersets = {
    [primary.fullName]: true,
    [secondary.fullName]: true,
    ...pools.reduce((acc, { fullName }) => {
      acc[fullName] = true;
      return acc;
    }, {}),
  };

  // Add excluded sets
  type Prevents = Array<{ preventedSet: string, excludedBy: string }>;
  const primaryPrevents: Prevents = (primary.prevents || []).map(
    (preventedSet) => ({
      preventedSet,
      excludedBy: primary.displayName,
    })
  );

  const secondaryPrevents: Prevents = (secondary.prevents || []).map(
    (preventedSet) => ({
      preventedSet,
      excludedBy: secondary.displayName,
    })
  );

  const poolsPrevents: Prevents = pools.reduce((acc, pool) => {
    if (pool.prevents) {
      return [
        ...acc,
        ...pool.prevents.map((preventedSet) => ({
          preventedSet,
          excludedBy: pool.displayName,
        })),
      ];
    }

    return acc;
  }, []);

  [...primaryPrevents, ...secondaryPrevents, ...poolsPrevents].forEach(
    ({ preventedSet, excludedBy }) =>
      (results.excluded.powersets[preventedSet] = excludedBy)
  );

  return results;
}
