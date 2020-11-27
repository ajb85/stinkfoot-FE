// @flow

import type { ShopperEnhancement } from "flow/types.js";

const stringIncludes = (includes: string) => (str: string): boolean => {
  return str.toLowerCase().includes(includes.toLowerCase());
};

export default (
  keyword: string,
  setName: string,
  enhancements: Array<ShopperEnhancement>
): boolean => {
  if (!keyword || keyword.split(" ").filter((x) => x).length === 0) {
    return true;
  }

  const isKeywordInString = stringIncludes(keyword);

  if (isKeywordInString(setName)) {
    return true;
  }

  for (let i = 0; i < enhancements.length; i++) {
    const { name, powerList } = enhancements[i];

    if (isKeywordInString(name)) {
      return true;
    }

    const powerNames = Object.keys(powerList);
    for (let j = 0; j < powerNames.length; j++) {
      const p = powerNames[j];
      if (isKeywordInString(p)) {
        return true;
      }
    }
  }

  return false;
};
