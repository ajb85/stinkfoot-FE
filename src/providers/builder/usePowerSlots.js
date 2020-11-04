import React, { useState, createContext, useContext } from "react";

import powerSlotsTemplate from "data/powerSlotsTemplate.js";
import slotsManager from "js/slotsManager.js";

const context = createContext();

let timeout;
export const PowerSlotsProvider = (props) => {
  const [powerSlots, setPowerSlots] = useState(powerSlotsTemplate);
  const { Provider } = context;
  console.log("POWERSLOTS: ", powerSlots);
  const removePowerFromSlot = ((cache) => (index) => {
    // Experimenting with this pattern, allows multiple calls to the same
    // state updater to pool up the instructions then loop over them and make a single
    // state update
    cache.push(index);
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      const newSlots = [...powerSlots];
      cache.forEach((index) => {
        if (newSlots[index].enhSlots.length > 1) {
          console.log("RETURNING SLOTS!");
          newSlots[index].enhSlots.forEach(
            ({ slotLevel }) => slotLevel && slotsManager.returnSlot(slotLevel)
          );
        }
        newSlots[index] = powerSlotsTemplate[index];
      });
      setPowerSlots(newSlots);
      cache = [];
      timeout = null;
    });
  })([]);

  const addPowerToSlot = ((cache) => (power, index) => {
    // Experimenting with this pattern, allows multiple calls to the same
    // state updater to pool up the instructions then loop over them and make a single
    // state update
    timeout && clearTimeout(timeout);
    cache.push({ power, index });
    timeout = setTimeout(() => {
      const newSlots = [...powerSlots];
      cache.forEach(({ power, index }) => {
        newSlots[index] = {
          ...newSlots[index],
          power,
          enhSlots: emptyDefaultSlot(),
        };
      });
      setPowerSlots(newSlots);
      cache = [];
      timeout = null;
    });
  })([]);

  const addEnhancement = (powerSlotIndex, enhancement) => {
    const powerSlot = powerSlots[powerSlotIndex];
    if (
      powerSlot.enhSlots &&
      powerSlot.enhSlots.length < 6 &&
      slotsManager.previewSlots(powerSlot.level)
    ) {
      // Copy State
      const updatedPowerSlots = copyPowerSlots(powerSlots, powerSlotIndex);
      // Mutate copy
      updatedPowerSlots[powerSlotIndex].enhSlots.push({
        level: slotsManager.getSlot(powerSlot.level),
        enhancement,
      });

      setPowerSlots(updatedPowerSlots);
    }
  };

  const addEnhancements = (powerSlotIndex, enhancements) => {
    if (
      !powerSlots[powerSlotIndex].slottable ||
      !powerSlots[powerSlotIndex].enhSlots
    ) {
      // Either the power slot isn't slot-able or there is no power there currently
      // Regardless, enhancements cannot be added
      return;
    }

    const updatedPowerSlots = copyPowerSlots(powerSlots, powerSlotIndex);

    // Return & erase existing slots
    const powerSlot = updatedPowerSlots[powerSlotIndex];

    powerSlot.enhSlots.forEach(
      ({ slotLevel }) => slotLevel && slotsManager.returnSlot(slotLevel)
    );
    powerSlot.enhSlots = emptyDefaultSlot();

    enhancements.forEach((enhancement, i) => {
      const slotLevel =
        powerSlot.enhSlots[i].slotLevel === null
          ? null
          : slotsManager.getSlot(powerSlot.level);

      powerSlot.enhSlots[i] = { slotLevel, enhancement };
    });

    setPowerSlots(updatedPowerSlots);
  };

  const removeEnhancement = (powerSlotIndex, enhIndex) => {
    const updatedPowerSlots = copyPowerSlots(powerSlots, powerSlotIndex);
    const { enhSlots } = updatedPowerSlots[powerSlotIndex];
    const { slotLevel } = enhSlots[enhIndex];

    // If slotLevel is null then remove the next slot if it exists
    const slotToRemove = slotLevel || enhSlots[1] ? enhSlots[1].level : null;
    if (slotToRemove) {
      slotsManager.returnSlot(slotToRemove);
    }

    if (!slotLevel) {
      // If we are removing the default enhancement slot, shift enhancements left
      enhSlots.unshift();
      if (enhSlots.length) {
        enhSlots[0].slotLevel = null;
      } else {
        updatedPowerSlots[powerSlotIndex].enhSlots = emptyDefaultSlot();
      }
    } else {
      updatedPowerSlots[powerSlotIndex].enhSlots = enhSlots.filter(
        (_, i) => i !== enhIndex
      );
    }

    setPowerSlots(updatedPowerSlots);
  };

  const state = {
    powerSlots,
    removePowerFromSlot,
    addPowerToSlot,
    addEnhancement,
    addEnhancements,
    removeEnhancement,
  };
  return <Provider value={state}>{props.children}</Provider>;
};

export default () => useContext(context);

export function emptyDefaultSlot() {
  return [
    {
      slotLevel: null,
    },
  ];
}

export function copyPowerSlots(powerSlots, index) {
  const newSlots = [...powerSlots];

  if (index) {
    const powerSlot = newSlots[index];
    const pSlot = { ...powerSlot };
    const enhSlots =
      pSlot.enhSlots &&
      pSlot.enhSlots.map((es) => {
        const eSlot = { ...es };
        const enhancement = eSlot.enhancement && { ...eSlot.enhancement };
        if (enhancement) {
          eSlot.enhancement = enhancement;
        }
        return eSlot;
      });

    if (enhSlots) {
      pSlot.enhSlots = enhSlots;
    }

    newSlots[index] = pSlot;
  }
  return newSlots;
}
