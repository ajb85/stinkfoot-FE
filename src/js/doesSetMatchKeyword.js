const stringIncludes = (includes) => (str) => {
  return str.toLowerCase().includes(includes.toLowerCase());
};

export default (keyword, setName, enhancements) => {
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
