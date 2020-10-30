import { getPower } from "./powersets.js";
import { getEnhancement } from "./enhancements.js";

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
  let accumulator;
  let currentPower;
  let currentIndex;
  function evaluateEnhSlot({ enhancement }) {
    if (!enhancement) {
      return;
    }
    // enhancement -> displayName, fullName, imageName, level, setIndex (set only), tier, type
    const e = getEnhancement(enhancement);
    if (e.isUnique) {
      // Record any existing unique enhancements
      accumulator.excluded.enhancements[e.fullName] = true;
    }

    if (!accumulator.lookup.enhancements[e.fullName]) {
      // If enhancement is new, setup initial state
      accumulator.lookup.enhancements[e.fullName] = {};
    }

    const record = accumulator.lookup.enhancements[e.fullName];
    const recordOfEnh = record[currentPower.fullName];

    if (recordOfEnh) {
      // Increment its count if power is already added for this enhancement
      recordOfEnh.count++;
      recordOfEnh.powerSlotIndices.push(currentIndex);
    } else {
      // Create the record for a new power for this enhancement
      recordOfEnh[currentPower.fullName] = {
        powerDisplayName: currentPower.displayName,
        powerSlotIndices: [currentIndex],
        count: 1,
      };
    }
  }

  return function reduceSlot(acc, { enhSlots, level, power, type }, i) {
    const isEmpty = !power || !enhSlots;
    if (isEmpty) {
      return acc;
    }

    // Save power in look up
    currentPower = getPower(power, archetype);
    currentIndex = i;
    acc.lookup.powers[currentPower.fullName] = i;

    // Save enhancements in look up
    accumulator = acc;
    enhSlots.forEach(evaluateEnhSlot);

    return acc;
  };
}

function getInitialAcc() {
  return {
    lookup: { powers: {}, powersets: {}, enhancements: {} },
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
