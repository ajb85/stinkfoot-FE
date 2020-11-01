import React, { useState, createContext, useContext } from "react";

import powerSlotsTemplate from "data/powerSlotsTemplate.js";
import slotsManager from "js/slotsManager.js";

const context = createContext();

export const PowerSlotsProvider = (props) => {
  const [powerSlots, setPowerSlots] = useState(powerSlotsTemplate);

  const { Provider } = context;

  const removePowerFromSlot = (index) => {
    const newSlots = [...powerSlots];
    newSlots[index] = powerSlotsTemplate[index];
    setPowerSlots(newSlots);
  };

  const addPowerToSlot = (power, index) => {
    const newSlots = [...powerSlots];
    newSlots[index] = {
      ...newSlots[index],
      power,
      enhSlots: emptyDefaultSlot(),
    };
    setPowerSlots(newSlots);
  };

  const addEnhancement = (powerSlotIndex, enhancement) => {
    const powerSlot = powerSlots[powerSlotIndex];
    if (
      powerSlot.enhSlots &&
      powerSlot.enhSlots.length < 6 &&
      slotsManager.previewSlot(powerSlot.level)
    ) {
      const updatedPowerSlots = powerSlots.map((ps, i) => {
        if (i === powerSlotIndex) {
          return {
            ...ps,
            enhSlots: [
              ...ps.enhSlots,
              { level: slotsManager.getSlot(ps.level), enhancement },
            ],
          };
        }

        return ps;
      });

      setPowerSlots(updatedPowerSlots);
    }
  };

  const removeEnhancement = (powerSlotIndex, enhIndex) => {
    const { enhSlots } = powerSlots[powerSlotIndex];
    const { slotLevel } = enhSlots[enhIndex];

    if (!slotLevel && enhSlots.length === 1) {
      // Default slot that doesn't go away, no need to recalculate slots
      return setPowerSlots(
        powerSlots.map((ps, i) =>
          i === powerSlotIndex ? { ...ps, enhSlots: emptyDefaultSlot() } : ps
        )
      );
    }

    slotsManager.reset();
    const updatedPowerSlots = powerSlots.map((ps, i) => {
      if (!ps.enhSlots) {
        return ps;
      }

      const isUpdatingPowerSlot = i === powerSlotIndex;
      const enhSlots = ps.enhSlots.reduce((acc, eSlot, j) => {
        const isRemovingEnh = j === enhIndex;
        if (isUpdatingPowerSlot && isRemovingEnh) {
          return acc;
        } else if (!eSlot.slotLevel) {
          acc.push(eSlot);
        } else {
          acc.push({
            ...eSlot,
            level: acc.length ? slotsManager.getSlot(ps.level) : null, // If the user removed the 0 index, we need to replace it
          });
        }
        return acc;
      }, []);

      return { ...ps, enhSlots };
    });

    setPowerSlots(updatedPowerSlots);
  };

  const state = {
    powerSlots,
    removePowerFromSlot,
    addPowerToSlot,
    addEnhancement,
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
