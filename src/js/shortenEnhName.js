// @flow

const shortened = {
  Accuracy: "Acc",
  Damage: "Dmg",
  Defense: "Def",
  Endurance: "End",
  "Endurance Reduction": "End",
  "Fly Speed": "Fly",
  Healing: "Heal",
  "Hit Points": "HP",
  "Jump Speed": "Jump",
  Recharge: "Rech",
  "Run Speed": "Run",
  Range: "Range",
  Slow: "Slow",
  Immobilize: "Immob",
  Immob: "Immob",
};

export default function shortenEnhName(name: string): string {
  // shortenEnhName
  return name
    .split("/")
    .map((n) => (shortened[n] ? shortened[n] : "*" + n))
    .join("/");
}
