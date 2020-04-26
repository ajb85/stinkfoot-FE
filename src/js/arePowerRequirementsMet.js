export default function (build, power) {
  const { powerSlots, activeLevel } = build;
  const {
    requires: { powers, count },
  } = power;

  if (!powers || !count) {
    return true;
  }

  const requiredLookUp = powers.reduce((acc, cur) => {
    acc[cur] = true;
    return acc;
  }, {});

  let countedPowers = 0;
  let currentLevel = 0;

  for (let i = 0; currentLevel < activeLevel; i++) {
    const powerSlot = powerSlots[i];
    if (requiredLookUp[powerSlot.fullName]) {
      if (countedPowers + 1 >= count) {
        return true;
      }
      countedPowers++;
    }
    currentLevel = powerSlot.level;
  }

  return false;
}
