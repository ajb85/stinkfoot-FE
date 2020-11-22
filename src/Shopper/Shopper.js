import React from "react";

import ShoppingList from "./ShoppingList/";

import useCharacters from "providers/useCharacters.js";
import ioSets from "data/ioSets.js";

export default function Shopper() {
  window.title = "Shopping List";
  const { activeCharacter } = useCharacters();

  const shoppingListLookup = activeCharacter.powerSlots.reduce(reduceList, {});
  const shoppingList = Object.entries(shoppingListLookup)
    .reduce((acc, [setName, enhancements]) => {
      const setData = { setName };
      setData.enhancements = Object.entries(enhancements).reduce(
        (accumulator, [name, data]) => {
          accumulator.push({ name, ...data });
          return accumulator;
        }
      );
      return acc;
    }, [])
    .sort(sortShoppingList);

  return <ShoppingList list={shoppingList} />;
}

function reduceList(acc, { enhSlots, power }) {
  if (enhSlots) {
    enhSlots.forEach(({ enhancement: e }) => {
      if (!e) {
        return;
      }

      const { setIndex, setType } = enhancement;
      if (setIndex !== undefined) {
        const set = ioSets[setType][setIndex];
        if (!acc[set.displayName]) {
          // Ensure the set category exists
          acc[set.displayName] = {};
        }
        const setLookup = acc[set.displayName];
        if (!setLookup[e.display]) {
          // Ensure the enhancement is listed in the set category
          setLookup[e.displayName] = { powerList: [], count: 0 };
        }

        const eLookup = setLookup[e.displayName];
        if (!eLookup.powerList.find((name) => name !== power.displayName)) {
          // Add the power to the list of powers this enhancement appears in
          eLookup.powerList.push(power.displayName);
        }

        // Increment the count
        eLookup.count++;
      }
    });
  }
  return acc;
}

function sortShoppingList(a, b) {
  // [{ setName, enhancements: [{ name, powerList, count }] }]
  const firstCount = a.enhancements.reduce(countEnhancements, 0);
  const secondCount = b.enhancements.reduce(countEnhancements, 0);
  return firstCount > secondCount ? -1 : 1;
}

function countEnhancements(acc, { count }) {
  return acc + count;
}
