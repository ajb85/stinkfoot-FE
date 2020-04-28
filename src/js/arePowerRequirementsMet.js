export default function (stateManager, power) {
  const { powerSlots, powerLookup, activeLevelIndex } = stateManager.build;
  const {
    requires: { powers, count },
  } = power;

  if (!powers || !count) {
    return true;
  }

  let countedPowers = 0;

  const length = stateManager.doesBuildHavePower(power)
    ? powerLookup[power.fullName]
    : activeLevelIndex;

  for (let i = 0; i <= length; i++) {
    const powerSlot = powerSlots[i];
    const powerInSlot = stateManager.getPower(powerSlot.power);
    if (powerInSlot && powers[powerInSlot.fullName]) {
      countedPowers++;
      if (countedPowers >= count) {
        return true;
      }
    }
  }

  return false;
}
