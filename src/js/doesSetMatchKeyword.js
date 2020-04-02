const stringIncludes = includes => str => {
  return str.toLowerCase().includes(includes.toLowerCase());
};

export default (keyword, setName, enhancements) => {
  if (!keyword || keyword === ' ') {
    return true;
  }
  const isKeywordInString = stringIncludes(keyword);
  if (isKeywordInString(setName)) {
    return true;
  }

  for (let e in enhancements) {
    if (isKeywordInString(e)) {
      return true;
    }
  }
};
