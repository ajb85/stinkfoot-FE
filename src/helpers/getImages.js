import allOrigins from "data/origins.js";
import ioSets from "data/ioSets.js";

const enhImages = require.context("./images/enhancements/", true);
const overlayImages = require.context("./images/overlays/", true);
const atImages = require.context("./images/archetypes/", true);
const psImages = require.context("./images/powersets/", true);

export const getOriginImage = (originName) => {
  const oImages = require.context("./images/origins/", true);
  return oImages(`./${originName}.png`).default;
};

export const getEnhancementImage = (name) => {
  return enhImages(`./${name}`).default;
};

export const getEnhancementOverlay = (origin, tier) => {
  // getEnhancementOverlay
  const oData = allOrigins.find((o) => o.name === origin);
  switch (tier) {
    case "IO":
      return overlayImages("./IO.png").default;
    case "TO":
      return overlayImages("./TO.png").default;
    case "SO":
    case "DO":
      return overlayImages(`./${oData[tier]}.png`).default;
    default:
      return null;
  }
};

export const getEnhancementImageWithOverlay = (origin, enh) => {
  // getEnhancementAndOverlayImages
  const { tier, type, setType, setIndex } = enh;
  const imageName = setType
    ? ioSets[setType][setIndex].imageName
    : enh.imageName;

  const enhancement = enhImages(`./${imageName}`).default;
  let overlay;
  if (type === "standard") {
    overlay = getEnhancementOverlay(origin, tier);
  } else if (type === "set") {
    overlay = getEnhancementOverlay(origin, "IO");
  }

  return {
    enhancement,
    overlay,
  };
};

export const getArchetypeImage = (atName) => {
  return atImages("./" + atName.split(" ").join("_") + ".png").default;
};

export const getPowersetImage = (imageName) => {
  const name = imageName.imageName || imageName;
  return psImages(`./${name}`).default;
};
