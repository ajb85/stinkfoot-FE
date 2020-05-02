export default function (stateManager, power) {
  const { powerSlots } = stateManager.build;
  const {
    requires: { powers, count },
  } = power;

  if (!powers || !count) {
    return true;
  }

  let countedPowers = 0;

  const length = stateManager.buildHasPower(power)
    ? stateManager.getPowerSlotIndexByPowerName(power.fullName)
    : stateManager.getFromState('activeLevelIndex');

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
