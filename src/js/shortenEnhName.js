// @flow

const shortened = {
  Accuracy: "Acc",
  Damage: "Dmg",
  Defense: "Def",
  Endurance: "End",
  "Fly Speed": "FlySpd",
  Healing: "Heal",
  "Hit Points": "HP",
  "Jump Speed": "JumpSpd",
  Recharge: "Rech",
  "Run Speed": "RunSpd",
};

export default (name: string): string => {
  // shortenEnhName
  return name
    .split("/")
    .map((n) => (shortened[n] ? shortened[n] : n))
    .join("/");
};
