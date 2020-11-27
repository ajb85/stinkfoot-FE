import type { PowerSlot } from "flow/types.js";

export default (ps: PowerSlot): { [key: string]: number } => {
  // getBonusTiersForPowerSlot
  const { enhSlots } = ps;
  return enhSlots.reduce((acc, { enhancement }) => {
    if (enhancement) {
      const { setIndex } = enhancement;

      if (setIndex) {
        acc[setIndex] = acc[setIndex] ? ++acc[setIndex] : (acc[setIndex] = 1);
      }
    }

    return acc;
  }, {});
};
