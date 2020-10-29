import usePowerSlots from "providers/builders/usePowerSlots.js";
import { getPower } from "helpers/powersets.js";
import useCharacterDetails from "providers/builder/useCharacterDetails.js";

export const usePowerSlotIndexByPowerName = (powerFullName) => {
  const { powerSlots } = usePowerSlots();
  const { character } = useCharacterDetails();
  const index = powerSlots.findIndex(({ power }) => {
    const p = getPower(power, character.archetype);
    return p && p.fullName === powerFullName;
  });
  return index > -1 ? index : null;
};
