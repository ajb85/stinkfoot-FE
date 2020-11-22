import React from "react";

import ShoppingList from "./ShoppingList/";

import useShoppingTotals from "providers/useShoppingTotals.js";
import useCharacters from "providers/useCharacters.js";

import ioSets from "data/ioSets.js";

export default function Shopper() {
  window.title = "Shopping List";
  const { getCountsForEnhancement, getCategoryCount } = useShoppingTotals();
  const { activeCharacter } = useCharacters();

  const shoppingListLookup = activeCharacter.powerSlots.reduce(
    reduceList.bind({ getCountsForEnhancement }),
    {}
  );

  const shoppingList = Object.entries(shoppingListLookup)
    .reduce((acc, [categoryName, enhancements]) => {
      const setData = { categoryName };
      setData.enhancements = Object.values(enhancements);
      acc.push(setData);
      return acc;
    }, [])
    .map(markComplete.bind({ shoppingListLookup }))
    .sort(sortShoppingList);

  return <ShoppingList list={shoppingList} lookup={shoppingListLookup} />;
}

function reduceList(acc, { enhSlots, power }) {
  if (enhSlots) {
    enhSlots.forEach(({ enhancement: e }) => {
      if (!e) {
        return;
      }

      const { setIndex, setType } = e;
      if (setIndex !== undefined) {
        const set = ioSets[setType][setIndex];
        const categoryName = set.displayName;
        if (!acc[categoryName]) {
          // Ensure the set category exists
          acc[categoryName] = {};
        }
        const setLookup = acc[categoryName];
        if (!setLookup[e.display]) {
          // Ensure the enhancement is listed in the set category
          setLookup[e.displayName] = {
            name: e.displayName,
            powerList: {},
            need: 0,
            have: this.getCountsForEnhancement(categoryName, e.displayName),
          };
        }

        const eLookup = setLookup[e.displayName];
        if (!eLookup.powerList[power.displayName]) {
          eLookup.powerList[power.displayName] = { count: 0 };
        }

        // Increment the counts
        eLookup.powerList[power.displayName].count++;
        eLookup.need++;
      }
    });
  }
  return acc;
}

function markComplete(category) {
  let isComplete = true;
  const { enhancements } = category;
  for (let i = 0; i < enhancements.length; i++) {
    const { have, need } = enhancements[i];
    if (have < need) {
      isComplete = false;
      break;
    }
  }

  category.isComplete = isComplete;
  this.shoppingListLookup[category.categoryName].isComplete = isComplete;
  return category;
}

function sortShoppingList(a, b) {
  // [{ categoryName, enhancements: [{ name, powerList, need, have }] }]
  const firstCount = a.enhancements.reduce(countNeed, 0);
  const secondCount = b.enhancements.reduce(countNeed, 0);

  const isFirstComplete = a.isComplete;
  const isSecondComplete = b.isComplete;
  const bothComplete = isFirstComplete && isSecondComplete;
  const bothIncomplete = !isFirstComplete && !isSecondComplete;

  if (bothComplete || bothIncomplete) {
    return firstCount > secondCount ? -1 : 1;
  }

  return isFirstComplete ? 1 : -1;
}

function countNeed(acc, { need }) {
  return acc + need;
}
