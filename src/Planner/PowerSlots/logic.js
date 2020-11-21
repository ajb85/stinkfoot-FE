export const reducer = (view, index = 0) => (acc, cur, powerSlotIndex) => {
  const psWithIndex = { ...cur, powerSlotIndex };
  if (cur.type === "default") {
    acc.defaults.push(psWithIndex);
  } else if (view === "level") {
    acc.selected[index].push(psWithIndex);
    if (acc.selected[index].length >= 8) {
      index++;
    }
  } else if (view === "respec") {
    const { power } = psWithIndex;
    if (!power) {
      acc.empties.push(psWithIndex);
    } else {
      const ato = power.archetypeOrder;
      const atoIndex = ato === "primary" ? 0 : ato === "secondary" ? 1 : 2;

      acc.selected[atoIndex].push(psWithIndex);
    }
  }
  return acc;
};

export const getInitialAcc = () => ({
  selected: [[], [], []],
  defaults: [],
  empties: [],
});

export const elementsPerIndex = 3;
