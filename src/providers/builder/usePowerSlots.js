import React, { createContext, useContext } from "react";

import useCharacters from "../useCharacters.js";

import slotsManager from "js/slotsManager.js";
import powerSlotsTemplate from "data/powerSlotsTemplate.js";

const context = createContext();

let timeout;
export const PowerSlotsProvider = (props) => {
  const { activeCharacter, updateActiveCharacter } = useCharacters();
  const setPowerSlots = (value) => updateActiveCharacter("powerSlots", value);
  const { powerSlots } = activeCharacter;
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
      const { enhSlots } = updatedPowerSlots[powerSlotIndex];
      !enhSlots[0].enhancement
        ? (enhSlots[0].enhancement = enhancement)
        : enhSlots.push({
            slotLevel: slotsManager.getSlot(powerSlot.level),
            enhancement,
          });
      enhSlots.sort((a, b) => a.slotLevel - b.slotLevel);
      setPowerSlots(updatedPowerSlots);
    }
  };

  const AddMultiEnhancements = (powerSlotIndex, enhancements) => {
    if (!powerSlots[powerSlotIndex].enhSlots) {
      console.log("INVALID SLOT", powerSlotIndex, powerSlots[powerSlotIndex]);
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
      const slotExists = !!powerSlot.enhSlots[i];
      const isDefaultSlot =
        slotExists && powerSlot.enhSlots[i].slotLevel === null;
      const slotLevel = isDefaultSlot
        ? null
        : slotsManager.getSlot(powerSlot.level);

      const newSlot = { slotLevel, enhancement };
      if (slotExists) {
        powerSlot.enhSlots[i] = newSlot;
      } else {
        powerSlot.enhSlots.push(newSlot);
      }
    });

    setPowerSlots(updatedPowerSlots);
  };

  const removeEnhancement = (powerSlotIndex, enhIndex) => {
    const updatedPowerSlots = copyPowerSlots(powerSlots, powerSlotIndex);
    const { enhSlots } = updatedPowerSlots[powerSlotIndex];
    const { slotLevel } = enhSlots[enhIndex];
    // If slotLevel is null then remove the next slot if it exists
    const slotToReturn =
      slotLevel || (enhSlots[1] ? enhSlots[1].slotLevel : null);
    if (slotToReturn) {
      slotsManager.returnSlot(slotToReturn);
    }

    if (!slotLevel) {
      // If we are removing the default enhancement slot, shift enhancements left
      enhSlots.shift();
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

  const resetPowerSlots = () => setPowerSlots(powerSlotsTemplate);

  const state = {
    powerSlots,
    removePowerFromSlot,
    addPowerToSlot,
    addEnhancement,
    AddMultiEnhancements,
    removeEnhancement,
    resetPowerSlots,
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
