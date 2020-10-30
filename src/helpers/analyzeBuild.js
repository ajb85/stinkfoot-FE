import { getPower } from "./powersets.js";
import { getEnhancement } from "./enhancements.js";

export default ((cache) => (powerSlots, archetype, activeSets) => {
  if (cache.build === powerSlots) {
    return cache.results;
  }

  const reduceSlot = getSlotReducer(archetype);
  const results = powerSlots.reduce(reduceSlot, getInitialAcc());
  evaluateSets(activeSets, results);

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
    lookup: { powers: {}, enhancements: {} },
    excluded: { powers: {}, powersets: {}, enhancements: {} },
  };
}

function evaluateSets({ primary, secondary, pools }, acc) {
  const primaryPrevents = primary.prevents || [];
  const secondaryPrevents = secondary.prevents || [];
  const poolsPrevents = pools.reduce((acc, { prevents }) => {
    if (prevents) {
      return [...acc, ...prevents];
    }

    return acc;
  });

  [...primaryPrevents, ...secondaryPrevents, ...poolsPrevents].reduce(
    (acc, ex) => {
      acc[ex] = true;
      return acc;
    },
    acc.excluded.powersets
  );
}
