const initial = {
  powersLookup: {},
  enhancementsLookup: {},
  excludedPowers: {},
  excludedPowersets: {},
};

export default ((cache) => (build) => {
  if (cache.build === build) {
    return cache.results;
  }

  // analyze build
  const results = initial;

  cache.build = build;
  cache.results = results;

  return results;
})({});
