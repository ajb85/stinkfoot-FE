import usePowerSlots from "providers/builder/usePowerSlots.js";

export const useSetNavSection = (powerSlotIndex) => {
  const { updatePowerSlotNav } = usePowerSlots();
  return (navProps) => updatePowerSlotNav(powerSlotIndex, navProps);
};
