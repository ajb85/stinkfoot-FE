import React, { useState, createContext, useContext } from "react";

import getParsedFromLocalStorage from "js/getParsedFromLocalStorage.js";
import useCharacters from "./useCharacters.js";

const ShoppingContext = createContext();

/*
  Shopping Totals is a count of what the user has.
  So think of everything in this file as an inventory
  of "have" for the build

  shoppingTotals Structure:
   { 
    Sham: {
      Winter's Bite: { Accuracy/Damage: 1 },
      standards: { Recharge: 5 }
    }
   }
  */

export function ShoppingProvider(props) {
  const { activeCharacter } = useCharacters();
  const { name: active } = activeCharacter;

  const shoppingAmounts = getParsedFromLocalStorage("shoppingTotals");
  const [shoppingTotals, setShoppingTotals] = useState(shoppingAmounts);

  const updateTotals = (updated) => {
    localStorage.setItem("shoppingTotals", JSON.stringify(updated));
    setShoppingTotals(updated);
  };

  const updateActiveTotals = (values) => {
    const newTotals = { ...shoppingTotals };
    newTotals[active] = values;
    updateTotals(newTotals);
  };

  const updateCount = ((newTotals, timeout) => (
    categoryName,
    enhancementName,
    operation = "increment",
    setTo = 0
  ) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    if (!newTotals) {
      newTotals = { ...shoppingTotals[active] };
    }

    if (!newTotals[categoryName]) {
      newTotals[categoryName] = {};
    }

    if (!newTotals[categoryName][enhancementName]) {
      newTotals[categoryName][enhancementName] = 0;
    }

    newTotals[categoryName] = { ...newTotals[categoryName] };
    const currentCount = newTotals[categoryName][enhancementName];
    newTotals[categoryName][enhancementName] =
      operation === "reset"
        ? 0
        : operation === "increment"
        ? currentCount + 1
        : operation === "decrement"
        ? currentCount - 1
        : operation === "setTo"
        ? setTo
        : currentCount;

    timeout = setTimeout(() => {
      updateActiveTotals(newTotals);
      newTotals = null;
      timeout = null;
    }, 20);
  })();

  const getCountsForEnhancement = (categoryName, enhancementName) => {
    const totals = shoppingTotals[active];
    if (!totals[categoryName] || !totals[categoryName][enhancementName]) {
      return 0;
    }

    return totals[categoryName][enhancementName];
  };

  const getCategoryCount = (categoryName) => {
    const activeTotals = shoppingTotals[active];

    if (!activeTotals || !activeTotals[categoryName]) {
      return 0;
    }

    const category = activeTotals[categoryName];
    return Object.values(category).reduce((acc, cur) => acc + cur, 0);
  };

  if (active && !shoppingTotals[active]) {
    updateActiveTotals({});
  }

  const { Provider } = ShoppingContext;
  return (
    <Provider
      value={{
        shoppingTotals,
        activeTotals: shoppingTotals[active] || {},
        updateTotals,
        getCountsForEnhancement,
        updateActiveTotals,
        updateCount,
        getCategoryCount,
      }}
    >
      {props.children}
    </Provider>
  );
}

export default function useShoppingTotals() {
  return useContext(ShoppingContext);
}
