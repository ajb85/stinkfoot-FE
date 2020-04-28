export default function (stateManager, power) {
  const { powerSlots, activeLevelIndex } = stateManager.build;
  const {
    requires: { powers, count },
  } = power;

  if (!powers || !count) {
    return true;
  }

  let countedPowers = 0;

  for (let i = 0; i < activeLevelIndex; i++) {
    const powerSlot = powerSlots[i];
    if (powers[powerSlot.fullName]) {
      countedPowers++;

      if (countedPowers >= count) {
        return true;
      }
    }
  }

  return false;
}
