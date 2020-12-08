// @flow

// Effects
type EnhancementEffect = Array<any>;
type PowerEffect = Array<any>;
type BonusEffect = {};

// Data
export type Enhancement = {|
  aliases?: Array<string>,
  boostUsePlayerLevel: boolean,
  description:
    | string
    | {|
        long: string,
        short: string,
      |},
  displayName: string,
  effects: EnhancementEffect,
  fullName: string,
  image: string,
  imageName: string,
  imageNameSuperior?: string,
  imageSuperior?: string,
  isAttuned?: boolean,
  isUnique: boolean,
  setIndex?: number,
  setType?: number,
  tier: string,
  type: string,
|};

export type IOSet = {|
  displayName: string,
  effects: void,
  enhancements: Array<Enhancement>,
  fullName: string,
  image: string,
  imageSuperior: string,
  imageName: string,
  imageNameSuperior: string,
  isAttuned: boolean,
  isUnique?: boolean,
  levels: { min: number, max: number },
  setIndex: number,
  setType: number,
  setTypeName: string,
  type: string,
|};

export type IOSetLookup = {
  [key: string]: IOSet,
};

export type ShopperEnhancement = {|
  name: string,
  powerList: { [key: string]: { count: number } },
|};

export type EnhancementSlot = {|
  enhancement?: Enhancement,
  slotLevel: null | number,
  type: string,
  name?: string,
  modification?: string,
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
  hasGrantPowerEffect: boolean,
  ignoreEnh: Array<number>,
  ignore_Buff: Array<number>,
  level: number,
  neverAutoUpdate: boolean,
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

export type PowerSlot = {
  level: number,
  type: string,
  power?: Power,
  enhSlots?: Array<EnhancementSlot>,
};

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

export type BuildAnalysis = {
  excluded: {
    enhancements: { [key: string]: boolean },
    powers: { [key: string]: boolean },
    powersets: { [key: string]: string },
  },
  lookup: {
    enhancements: {
      // Enhancement full name
      [key: string]: {
        // Power full name
        [key: string]: {
          powerDisplayName: string,
          powerSlotIndices: Array<number>,
          count: number,
        },
      },
    },
    powers: { [key: string]: number },
    powersets: { [key: string]: boolean },
    setBonuses: { [key: string]: number },
    setsInPower: {
      [key: string]: {
        [key: string]: {
          count: number,
          set: IOSet,
        },
      },
    },
  },
};

// State
export type ActiveSets = {|
  primary: number,
  secondary: number,
  poolPower: number,
  epicPool: number,
  activeLevel: number,
  toggledSlot: null | number,
  toggledSet: null | number,
|};

export type EnhNav = {|
  section: string,
  tier: string,
  setType: null | number,
  setIndex: null | number,
  showSuperior: boolean,
|};

export type Powerset = {
  fullName: string,
  archetypeOrder: string,
  description: string,
  imageName: string,
  displayName: string,
  powers: Array<Power>,
  poolIndex?: number,
  prevents?: Array<string>,
};

export type ActivePowersets = {
  primary: Powerset,
  secondary: Powerset,
  pools: Array<Powerset>,
};

// BONUSES
export type RawBonus = {};

export type SetBonus = {
  effects: BonusEffect,
  description: {
    short: string,
    long: string,
  },
  isUnique: boolean,
  bonusName: string,
  powerSetIndex: number,
  fullName: string,
  setName: string,
  displayName: string,
  ignoreStrength: boolean,
  displays: Array<string>,
};

export type SetBonusesLookup = {
  [key: string]: SetBonus,
};

export type Bonus = {|
  unlocked: number,
  isPvP: boolean,
  bonus: SetBonus,
|};

export type BonusStatsForPower = {
  displays: Array<string>,
  isActive: boolean,
  bonusCount: number,
};

// SETTINGS
export type Settings = { showSuperior: boolean, pvp: boolean };

export type Version = {|
  version: string,
  clearStorage: boolean,
  notes: Array<string>,
|};
