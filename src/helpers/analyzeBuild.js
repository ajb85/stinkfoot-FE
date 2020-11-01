import ioSets from "data/ioSets.js";
import { getBonusesForCount } from "helpers/enhancements.js";

export default ((cache) => (powerSlots, archetype, activeSets) => {
  if (cache.build === powerSlots) {
    return cache.results;
  }

  const reduceSlot = getSlotReducer(archetype);
  const results = powerSlots.reduce(reduceSlot, getInitialAcc());
  evaluatePowersets(activeSets, results);

  cache.build = powerSlots;
  cache.results = results;
  return results;
})({});

function getSlotReducer(archetype) {
  return function reduceSlot(acc, { enhSlots, level, power, type }, i) {
    const isEmpty = !power || !enhSlots;
    if (isEmpty) {
      return acc;
    }

    // Save power in look up
    acc.lookup.powers[power.fullName] = i;

    enhSlots.forEach(({ enhancement }) => {
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
        recordOfEnh[power.fullName] = {
          powerDisplayName: power.displayName,
          powerSlotIndices: [i],
          count: 1,
        };
      }
    });

    // Tally set bonuses
    const powerBonuses = acc.lookup.setsInPower[power.fullName];
    Object.keys(powerBonuses).forEach((setName) => {
      const { set, count } = powerBonuses[setName];
      getBonusesForCount(set, count).forEach(({ name }) => {
        // Should consider PvP ?
        const { setBonuses } = acc.lookup;
        setBonuses[name] = setBonuses[name] ? setBonuses[name] + 1 : 1;
      });
    });
    return acc;
  };
}

function getInitialAcc() {
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

function evaluatePowersets({ primary, secondary, pools }, results) {
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
  const primaryPrevents = (primary.prevents || []).map((powerset) => {
    const p = { preventedSet: powerset };
    p.excludedBy = primary.displayName;
    return p;
  });

  const secondaryPrevents = (secondary.prevents || []).map((powerset) => {
    const p = { preventedSet: powerset };
    p.excludedBy = secondary.displayName;
    return p;
  });

  const poolsPrevents = pools.reduce((acc, { prevents }) => {
    if (prevents) {
      return [
        ...acc,
        ...prevents.map((powerset) => {
          const p = { preventedSet: powerset };
          p.excludedBy = secondary.displayName;
          return p;
        }),
      ];
    }

    return acc;
  });

  [...primaryPrevents, ...secondaryPrevents, ...poolsPrevents].reduce(
    (acc, { preventedSet, excludedBy }) => {
      acc.powersets[preventedSet] = excludedBy;
      return acc;
    },
    results.excluded.powersets
  );

  return results;
}
