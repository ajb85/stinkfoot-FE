import { getPower } from "./powersets.js";

export default (enhancement, powerSlot, archetype) => {
  // With isUnique, type, and fullName, this will return if the
  // enhancement can be added to a slot
  //   const powerSlot = this.nextState.build.powerSlots[powerSlotIndex];
  const power = getPower(powerSlot.power, archetype);

  const { isUnique, type, fullName } = enhancement;
  const enhLookup = this.nextState.lookup.enhancements;

  const isUniqueInPower = type === "set" || type === "attuned";
  const isInUse = !!enhLookup[fullName];
  const isInPower =
    isInUse &&
    enhLookup[enhancement.fullName].find(
      ({ powerName }) => powerName === power.fullName
    );

  return (
    (isUnique && !isInUse) ||
    (!isUnique && isUniqueInPower && !isInPower) ||
    (!isUnique && !isUniqueInPower)
  );
};
