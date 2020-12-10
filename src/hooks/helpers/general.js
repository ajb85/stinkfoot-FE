const toPlural = {
  primary: "primaries",
  secondary: "secondaries",
  poolPower: "poolPowers",
  epicPower: "epicPowers",
};

export function pluralizeOrder(order) {
  return toPlural[order] || order;
}

export function findLowestUnusedSlot(powerSlots) {
  const nextEmptySlotIndex = powerSlots.findIndex(({ power }) => !power);
  return !isNaN(parseInt(nextEmptySlotIndex)) ? nextEmptySlotIndex : null;
}

export function scanEnhancementsForLookup(acc, p, enhSlots) {
  enhSlots.forEach(({ enhancement }) => {
    if (!enhancement) {
      return;
    }

    if (enhancement.isUnique) {
      acc.uniqueEnhancements[enhancement.fullName] = p.displayName;
    }

    if (acc.enhancements[enhancement.fullName]) {
      const duplicate = acc.enhancements[enhancement.fullName].find(
        ({ fullName }) => fullName === p.fullName
      );

      if (duplicate) {
        duplicate.count++;
      } else {
        acc.enhancements[enhancement.fullName].push({
          fullName: p.fullName,
          powerName: p.displayName,
          count: 1,
        });
      }
    }
  });
}
