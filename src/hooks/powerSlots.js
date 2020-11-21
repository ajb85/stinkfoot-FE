import usePowerSlots from "providers/builders/usePowerSlots.js";

export const usePowerSlotIndexByPowerName = (powerFullName) => {
  const { powerSlots } = usePowerSlots();
  const index = powerSlots.findIndex(({ power }) => {
    return power && power.fullName === powerFullName;
  });
  return index > -1 ? index : null;
};
