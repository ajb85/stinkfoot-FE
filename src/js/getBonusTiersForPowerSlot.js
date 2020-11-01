export default ({ enhSlots }) => {
  // getBonusTiersForPowerSlot
  return enhSlots.reduce((acc, { enhancement }) => {
    if (enhancement) {
      const { setIndex } = enhancement;

      if (setIndex) {
        acc[setIndex] = acc[setIndex] ? ++acc[setIndex] : (acc[setIndex] = 1);
      }
    }

    return acc;
  }, {});
};
