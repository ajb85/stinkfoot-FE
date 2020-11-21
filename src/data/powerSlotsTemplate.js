const powerSlots = [
  {
    level: 1,
    type: "selected",
  },
  {
    level: 1,
    type: "selected",
  },
  {
    level: 2,
    type: "selected",
  },
  {
    level: 4,
    type: "selected",
  },
  {
    level: 6,
    type: "selected",
  },
  {
    level: 8,
    type: "selected",
  },
  {
    level: 10,
    type: "selected",
  },
  {
    level: 12,
    type: "selected",
  },
  {
    level: 14,
    type: "selected",
  },
  {
    level: 16,
    type: "selected",
  },
  {
    level: 18,
    type: "selected",
  },
  {
    level: 20,
    type: "selected",
  },
  {
    level: 22,
    type: "selected",
  },
  {
    level: 24,
    type: "selected",
  },
  {
    level: 26,
    type: "selected",
  },
  {
    level: 28,
    type: "selected",
  },
  {
    level: 30,
    type: "selected",
  },
  {
    level: 32,
    type: "selected",
  },
  {
    level: 35,
    type: "selected",
  },
  {
    level: 38,
    type: "selected",
  },
  {
    level: 41,
    type: "selected",
  },
  {
    level: 44,
    type: "selected",
  },
  {
    level: 47,
    type: "selected",
  },
  {
    level: 49,
    type: "selected",
  },
  {
    level: 1,
    name: "Brawl",
    enhSlots: [
      {
        slotLevel: null,
      },
    ],
    type: "default",
  },
  // {
  //   level: 1,
  //   name: 'Scourge',
  //   enhSlots: [],
  //   type: 'default',
  // },
  {
    level: 1,
    name: "Sprint",
    enhSlots: [
      {
        slotLevel: null,
      },
    ],
    type: "default",
  },
  {
    level: 2,
    name: "Rest",
    enhSlots: [
      {
        slotLevel: null,
      },
    ],
    type: "default",
  },
  {
    level: 4,
    name: "Ninja Run",
    enhSlots: [],
    type: "default",
  },
  {
    level: 2,
    name: "Swift",
    enhSlots: [
      {
        slotLevel: null,
      },
    ],
    type: "default",
  },
  {
    level: 2,
    name: "Health",
    enhSlots: [
      {
        slotLevel: null,
      },
    ],
    type: "default",
  },
  {
    level: 2,
    name: "Hurdle",
    enhSlots: [
      {
        slotLevel: null,
      },
    ],
    type: "default",
  },
  {
    level: 2,
    name: "Stamina",
    enhSlots: [
      {
        slotLevel: null,
      },
    ],
    type: "default",
  },
];

export default powerSlots;

export const powerSlotIndexLookup = powerSlots.reduce(
  (acc, { level, type, name }, i) => {
    if (type === "selected") {
      acc.selected[level] = i;
    } else if (type === "default") {
      acc.default[name] = i;
    }
    return acc;
  },
  { selected: {}, default: {} }
);
