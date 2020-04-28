export default function (build, power) {
  const { powerSlots, activeLevel } = build;
  const {
    requires: { powers, count },
  } = power;

  if (!powers || !count) {
    return true;
  }

  let countedPowers = 0;
  let currentLevel = 0;

  for (let i = 0; currentLevel < activeLevel; i++) {
    const powerSlot = powerSlots[i];
    if (powers[powerSlot.fullName]) {
      countedPowers++;

      if (countedPowers >= count) {
        return true;
      }
    }
    currentLevel = powerSlot.level;
  }

  return false;
}
