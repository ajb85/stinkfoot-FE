// Effects
type EnhancementEffect = Array<Any>;
type PowerEffect = Array<Any>;

export type Enhancement = {
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
};

export type Power = {
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
};
