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
  const isCategoryComplete = (categoryName) => {
    const have = getCategoryCount(categoryName);
    const need = Object.values(shoppingListLookup[categoryName]).reduce(
      (acc, { need }) => acc + need,
      0
    );
    return have >= need;
  };

  const shoppingList = Object.entries(shoppingListLookup)
    .reduce((acc, [categoryName, enhancements]) => {
      const setData = { categoryName };
      setData.enhancements = Object.values(enhancements);
      acc.push(setData);
      return acc;
    }, [])
    .sort(sortShoppingList.bind({ isCategoryComplete }));

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

function sortShoppingList(a, b) {
  // [{ categoryName, enhancements: [{ name, powerList, need, have }] }]
  const firstCount = a.enhancements.reduce(countNeed, 0);
  const secondCount = b.enhancements.reduce(countNeed, 0);

  const isFirstComplete = this.isCategoryComplete(a.categoryName);
  a.isComplete = isFirstComplete;
  const isSecondComplete = this.isCategoryComplete(b.categoryName);
  b.isComplete = isSecondComplete;
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
