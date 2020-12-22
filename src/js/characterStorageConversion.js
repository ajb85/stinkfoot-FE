// @flow
import {
  CharacterBuild,
  CharacterBuildRef,
  PowerSlot,
  Power,
  PowerRef,
  Enhancement,
  EnhancementRef,
  EnhancementSlotRef,
  EnhancementSlot,
} from "flow/types.js";

import enhancements from "data/enhancements.js";
import powersets from "data/powersets.js";
import poolPowers from "data/poolPowers.js";

export function prepareCharacterForStorage(
  character: CharacterBuild
): CharacterBuildRef {
  const storageChar = { ...character };
  storageChar.powerSlots = storageChar.powerSlots.map((ps) => {
    const noEnhancements =
      !ps.enhSlots || (ps.enhSlots.length === 1 && !ps.enhSlots[0].enhancement);
    if (!ps.power || noEnhancements) {
      return ps;
    }

    const newSlot = { ...ps };
    newSlot.enhSlots = newSlot.enhSlots.map(getEnhancementReferences);
    newSlot.power = getPowerReferences(newSlot.power);

    return newSlot;
  });

  return storageChar;
}

function getEnhancementReferences(powerSlot: PowerSlot): EnhancementRef {
  if (powerSlot.enhancement) {
    const { enhancement } = powerSlot;
    const {
      tier,
      type,
      standardIndex,
      setIndex,
      setType,
      fullName,
    } = enhancement;

    if (standardIndex !== undefined) {
      return { tier, type, standardIndex, fullName };
    }

    if (setIndex !== undefined && setType !== undefined) {
      return { tier, type, setIndex, setType, fullName };
    }

    return { tier: "unknown", type: "unknown", fullName: "unknown" };
  }
}

function getPowerReferences(power: Power): PowerRef {
  if (power) {
    const { archetypeOrder, fullName, powerIndex, poolIndex } = power;

    if (poolIndex !== undefined) {
      return { archetypeOrder, fullName, powerIndex, poolIndex };
    }

    return { archetypeOrder, fullName, powerIndex };
  }
}

export function prepareCharacterForApp(
  character: CharacterBuildRef | CharacterBuild
): CharacterBuild {
  const powerSlots = [...character.powerSlots];

  for (let i = 0; i < powerSlots.length; i++) {
    const firstEnhancement =
      powerSlots[i].enhSlots && powerSlots[i].enhSlots[0].enhancement;
    const isFullEnhancementData =
      firstEnhancement && firstEnhancement.displayName;
    if (isFullEnhancementData) {
      // Nothing to convert in this build, it's using the old style of storing full objects
      return character;
    }
    const slot: PowerSlot = { ...powerSlots[i] };

    slot.power = getPowerFromReference(slot.power);
    slot.enhSlots = slot.enhSlots.map(mapEnhancementsFromEnhSlotReference);
    powerSlots[i] = slot;
  }
}

function mapEnhancementsFromEnhSlotReference(
  enhSlotRef: EnhancementSlotRef
): EnhancementSlot {
  if (enhSlotRef.enhancement) {
    const {
      tier,
      type,
      standardIndex,
      fullName,
      setIndex,
      setType,
    } = enhSlotRef.enhancement;

    if (standardIndex !== undefined) {
      return { ...enhSlotRef, enhancement: false };
    }

    if (setIndex !== undefined && setType !== undefined) {
    }
  }
  return enhSlotRef;
}

function getPowerFromReference(powerRef: PowerRef): Power {}
