import React from "react";

import ShoppingList from "./ShoppingList/";

import useCharacters from "providers/useCharacters.js";
import ioSets from "data/ioSets.js";

export default function Shopper() {
  window.title = "Shopping List";
  const { activeCharacter } = useCharacters();

  const shoppingList = activeCharacter.powerSlots.reduce(getShoppingList, {});
  return (
    <ShoppingList list={Object.entries(shoppingList).sort(sortShoppingList)} />
  );
}

function getShoppingList(acc, { enhSlots, power }) {
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
  // [setName, {enhancement: { powerList, count }}]
  const firstCount = Object.values(a[1]).reduce(countEnhancements, 0);
  const secondCount = Object.values(b[1]).reduce(countEnhancements, 0);
  return firstCount > secondCount ? -1 : 1;
}

function countEnhancements(acc, { count }) {
  return acc + count;
}
