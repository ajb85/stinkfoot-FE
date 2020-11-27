// @flow

// Effects
type EnhancementEffect = Array<any>;
type PowerEffect = Array<any>;

export type Enhancement = {|
  boostUsePlayerLevel: boolean,
  description:
    | string
    | {
        long: string,
        short: string,
      },
  displayName: string,
  effects: EnhancementEffect,
  fullName: "Boosts.Attuned_Unbreakable_Guard_A.Attuned_Unbreakable_Guard_A",
  image: string,
  imageName?: string,
  isUnique: boolean,
  setIndex?: number,
  setType?: number,
  tier: string,
  type: string,
  aliases?: Array<string>,
|};

export type IOSet = {|
  displayName: string,
  enhancements: Array<Enhancement>,
  fullName: string,
  imageName: string,
  imageNameSuperior: string,
  isAttuned: true,
  levels: { min: number, max: number },
  setIndex: number,
  setType: number,
  setTypeName: string,
|};

export type ShopperEnhancement = {|
  name: string,
  powerList: { [key: string]: { count: number } },
|};

export type EnhancementSlot = {|
  slotLevel: null | number,
  enhancement: Enhancement,
|};

export type Power = {|
  accuracy: number,
  accuracyMult: number,
  allowedEnhancements: Array<string>,
  aoeModifier: number,
  archetypeOrder: string,
  attackTypes: number,
  baseRechargeTime: number,
  castTime: number,
  castTimeReal: number,
  description: {
    short: string,
    long: string,
  },
  displayName: string,
  effectArea: number,
  effects: PowerEffect,
  endCost: number,
  enhancementCount: number,
  fullName: string,
  hasGrantPowerEffect: true,
  ignoreEnh: Array<number>,
  ignore_Buff: Array<number>,
  level: number,
  neverAutoUpdate: true,
  numAllowed: number,
  ogFullName: string,
  powerIndex: number,
  range: number,
  rechargeTime: number,
  requires: {
    count: number,
    powers: {
      [key: string]: boolean,
    },
  },
  setTypes: Array<number>,
  slottable: boolean,
  target: number,
  targetLoS: boolean,
  toggleCost: number,
|};

export type PowerSlot = {|
  level: number,
  power: Power,
  enhSlots: Array<EnhancementSlot>,
  type: string,
|};

export type Badge = {|
  badgeIndex: number,
  badgeSection: string,
  completed: boolean,
  hero: boolean,
  name: string,
  notes: string,
  praetorian: boolean,
  villain: boolean,
|};

export type CharacterBuild = {|
  archetype: string,
  badges: {
    accolade: Array<Badge>,
    accomplishment: Array<Badge>,
    achievement: Array<Badge>,
    dayJob: Array<Badge>,
    defeat: Array<Badge>,
    exploration: Array<Badge>,
    history: Array<Badge>,
  },
  name: string,
  origin: string,
  poolPowers: Array<number>,
  powerSlots: Array<PowerSlot>,
|};

export type BuildAnalysis = {|
  excluded: {|
    enhancements: { [key: string]: boolean },
    powers: { [key: string]: boolean },
    powersets: { [key: string]: boolean },
  |},
  lookup: {|
    enhancements: {
      [key: string]: {|
        count: number,
        powerDisplayName: string,
        powerSlotIndices: Array<number>,
      |},
    },
    powers: { [key: string]: number },
    powersets: { [key: string]: boolean },
    setBonuses: { [key: string]: number },
    setsInPower: {
      [key: string]: { [key: string]: {| count: number, set: IOSet |} },
    },
  |},
|};

export type ActiveSets = {|
  primary: number,
  secondary: number,
  poolPower: number,
  epicPool: number,
  activeLevel: number,
  toggledSlot: null | number,
  toggledSet: null | number,
|};
