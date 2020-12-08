// @flow

import poolPowers from "data/poolPowers.js";
import powersets from "data/powersets.js";
import epicPools from "data/epicPools.js";
import origins from "data/origins.js";
import getEnhancementFromName from "js/getEnhancementFromName.js";
import type { CharacterBuild, EnhancementSlot } from "flow/types.js";

type ParsingPowerSlot = {
  level: number,
  type?: string,
  power?: string,
  enhSlots?: Array<EnhancementSlot>,
};

const atOrderToPlural = {
  primary: "primaries",
  secondary: "secondaries",
};

export default function (str: string): CharacterBuild | { error: string } {
  try {
    if (str.length < 100) {
      return {
        error:
          "It doesn't look like you currently have a mids build copied, please follow the steps above again.",
      };
    }

    if (str.indexOf("<font") < 0) {
      return {
        error:
          "You likely forgot to select HTML Export from Formatting Code Type.  Please double check the steps above.",
      };
    }
    const character = {
      name: "",
      archetype: "",
      origin: "",
      powerSlots: [],
      poolPowers: [],
      activeSets: {
        primary: null,
        secondary: null,
        poolPower: null,
        epicPool: null,
        activeLevel: null,
        toggledSlot: null,
        toggledSet: null,
      },
      badges: {},
    };

    const tagArray = str.split("<font").slice(4);

    const hasName = getTagContent(tagArray[1]) !== "Primary Power Set: ";
    if (hasName) {
      character.name = stripNonAlphanumeric(getTagContent(tagArray.shift()));
    }

    const ogContent = getTagContent(tagArray.shift());
    const [a, b, c] = ogContent.split(" ").slice(2);
    const isExtraSpace = !isNaN(parseInt(a));
    const origin = isExtraSpace ? b : a;
    const archetype = isExtraSpace ? c : b;

    if (powersets[archetype]) {
      character.archetype = archetype;
    }

    if (origins.find((name) => name === origin)) {
      character.origin = origin;
    }

    if (!character.archetype) {
      // Unrecognized archetype
      return { error: `Archetype '${archetype}' is currently unsupported` };
    }

    tagArray.shift(); // Primary Power Set:
    const primary = stripNonAlphanumeric(getTagContent(tagArray.shift()));
    putPowersetInBuild(character, "primary", primary);

    tagArray.shift(); // Secondary Power Set:
    const secondary = stripNonAlphanumeric(getTagContent(tagArray.shift()));
    putPowersetInBuild(character, "secondary", secondary);

    while (getTagContent(tagArray[0]) === "Power Pool: ") {
      // Pool Power Set:
      tagArray.shift();
      const pool = stripNonAlphanumeric(getTagContent(tagArray.shift()));
      putPowersetInBuild(character, "poolPower", pool);
    }

    const hasEpic = getTagContent(tagArray.shift()) === "Ancillary Pool: "; // Ancillary Power Set:
    if (hasEpic) {
      const epic = stripNonAlphanumeric(getTagContent(tagArray.shift()));
      putPowersetInBuild(character, "epicPool", epic);
      tagArray.shift(); // Alignment, which is shifted off if !hasEpic
    }
    // Begin power slots
    let enhSlot: EnhancementSlot;

    let powerSlot: ParsingPowerSlot;
    let nextSlotLevel: string | null;
    let slotType: string = "selected";
    let halfName: boolean = false;
    const newSlot: EnhancementSlot = { slotLevel: null, type: "selected" };
    return tagArray.reduce((acc, str) => {
      const contents = getTagContent(str);
      if (contents === " IO") {
        // Useless info, just terminate early
        nextSlotLevel = getNextEnhancementSlotLevelFromStr(str);
        return acc;
      }

      const ioColor = ' color="#8BAFF1"';
      const standardColor = ' color="#5EAEFF"';
      if (contents.substring(0, 5) === "Level") {
        // is a new power slot
        if (powerSlot && powerSlot.enhSlots) {
          if (enhSlot) {
            powerSlot.enhSlots.push(enhSlot);
            enhSlot = { ...newSlot };
          }

          if (slotType === "selected") {
            const prevSlot = acc.powerSlots[acc.powerSlots.length - 1];
            slotType =
              !prevSlot || prevSlot.level <= powerSlot.level
                ? "selected"
                : "default";
          }
          acc.powerSlots.push(powerSlot);
        }

        powerSlot = {
          enhSlots: [],
          level: parseInt(
            contents.substring(contents.indexOf(" ") + 1, contents.indexOf(":"))
          ),
        };
        return acc;
      }

      if (str.indexOf("&nbsp;&nbsp;") > -1) {
        // is a power, &nbsp;&nbsp; only appears on levels & powers
        powerSlot.power = getTagContent(str);
        nextSlotLevel = getNextEnhancementSlotLevelFromStr(str);
        return acc;
      }

      if (contents.indexOf(" - ") > -1) {
        // is IO Set
        saveEnhancement(correctSetName(contents.split(" - ").shift()));
        enhSlot.type = "ioSet";
        halfName = true;
        return acc;
      }

      if (enhSlot && halfName) {
        halfName = false;
        if (enhSlot.name) {
          enhSlot.name += " // " + correctStatNames(contents);
        }
        nextSlotLevel = getNextEnhancementSlotLevelFromStr(str);
        return acc;
      }

      const color = str.substring(0, str.indexOf(">"));
      if (color === ioColor) {
        saveEnhancement(contents);
        enhSlot.type = "IO";
        nextSlotLevel = getNextEnhancementSlotLevelFromStr(str);
      }

      if (color === standardColor) {
        saveEnhancement(contents);
        enhSlot.type = "SO";
        nextSlotLevel = getNextEnhancementSlotLevelFromStr(str);
      }

      return acc;
    }, character);

    function saveEnhancement(contents) {
      if (enhSlot) {
        const { name, ...slot } = enhSlot;
        const sup = "Superior ";
        let correctedName = name;
        if (correctedName && contents.substring(0, sup.length) === sup) {
          correctedName = correctedName.substring(sup.length);
          slot.modification = "superior";
        }
        if (correctedName) {
          const enhancement = getEnhancementFromName(correctedName, slot.type);
          slot.enhancement = enhancement;
        }
        if (powerSlot.enhSlots) {
          powerSlot.enhSlots.push(slot);
        }
      }

      enhSlot = { ...newSlot };
      enhSlot.slotLevel =
        nextSlotLevel === "A" ? null : parseInt(nextSlotLevel);
      nextSlotLevel = null;

      enhSlot.name = contents;
    }
  } catch (err) {
    console.log("ENCOUNTERED ", err);
    return {
      error:
        "Whoops, something broke.  Paste your build to Sham so he can figure out what happened.",
    };
  }
}

function getNextEnhancementSlotLevelFromStr(str: string): string {
  const substring = str.substring(str.indexOf("<li>"));
  const startLevel = substring.indexOf("(") + 1;
  const endLevel = startLevel > 0 && substring.indexOf(")");
  if (endLevel && endLevel > 0) {
    // Can only be false or -1 for falsey
    return substring.substring(startLevel, endLevel);
  }

  return "";
}

function getTagContent(str: string): string {
  if (!str) {
    return "";
  }

  const endOfOpenTag = str.indexOf(">");
  if (endOfOpenTag < 0 || endOfOpenTag === str.length - 1) {
    return "";
  }

  // _REL tags are not absolute indices.  They are relative to a substring
  const startOfEndTag_REL = str.substring(endOfOpenTag + 1).indexOf("</");
  if (startOfEndTag_REL < 0) {
    return "";
  }

  const startOfEndTag = endOfOpenTag + 1 + startOfEndTag_REL;

  return str.substring(endOfOpenTag + 1, startOfEndTag);
}

function stripNonAlphanumeric(str: string): string {
  return str.replace(/[^\w\s]/gi, "");
}

function putPowersetInBuild(character, atOrder: string, powersetName: string) {
  if (!powersetName) {
    return;
  }

  let powersetIndex;
  const isNotPool = atOrder !== "poolPower";
  const isEpic = atOrder === "epicPool";

  const findName = findDisplayName(powersetName);
  if (isNotPool && !isEpic) {
    const pluralOrder = atOrderToPlural[atOrder];
    powersetIndex = powersets[character.archetype][pluralOrder].findIndex(
      findName
    );
  } else if (isEpic) {
    powersetIndex = epicPools[character.archetype].findIndex(findName);
  } else {
    powersetIndex = poolPowers.findIndex(findName);
  }

  if ((powersetIndex || powersetIndex === 0) && powersetIndex >= 0) {
    if (isNotPool) {
      character.activeSets[atOrder] = powersetIndex;
    } else {
      character.poolPowers.push(powersetIndex);
    }
  }
}

function findDisplayName(powersetName: string): { [key: string]: any } {
  return ({ displayName }) => displayName === powersetName;
}

const mapToCorrectStats = {
  RechargeTime: "Recharge",
  Heal: "Healing",
  "TP Protection +3% Def (All)": "Teleportation Protection, +Def(All)",
  "+Res (Teleportation), +5% Res (All)": "Teleportation Protection, +Res(All)",
  "+Regeneration": "Regeneration",
  "+Recovery": "Recovery",
  "Chance for +End": "Chance for +Endurance",
};

const mapToCorrectName = {
  "Damage/Endurance/Accuracy/Recharge": "Accuracy/Damage/Endurance/Recharge",
  Healing: "Healing/Absorb",
};
function correctStatNames(stats: string): string {
  const correctedStats = stats
    .split("/")
    .map((n) => mapToCorrectStats[n] || n)
    .join("/");

  return mapToCorrectName[correctedStats] || correctedStats;
}

const mapToCorrectSetName = {
  "Numina's Convalesence": "Numina's Convalescence",
};

function correctSetName(setName: string): string {
  return mapToCorrectSetName[setName] || setName;
}
