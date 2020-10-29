import { allOrigins } from "hooks/powersets.js";

const enhImages = require.context("./images/enhancements/", true);
const overlayImages = require.context("./images/overlays/", true);
const atImages = require.context("./images/archetypes/", true);
const psImages = require.context("./images/powersets/", true);

export const getOriginImage = (originName) => {
  const oImages = require.context("./images/origins/", true);
  return oImages(`./${originName}.png`);
};

export const getEnhancementImage = (name) => {
  return enhImages(`./${name}`);
};

export const getEnhancementOverlay = (tier) => {
  // getEnhancementOverlay
  const oData = allOrigins.find((o) => o.name === this.origin);

  switch (tier) {
    case "IO":
      return overlayImages("./IO.png");
    case "TO":
      return overlayImages("./TO.png");
    case "SO":
    case "DO":
      return overlayImages(`./${oData[tier]}.png`);
    default:
      return overlayImages("./OldClass.png");
  }
};

export const getEnhancementImageWithOverlay = ({ imageName, tier, type }) => {
  // getEnhancementAndOverlayImages
  const enhancement = enhImages(`./${imageName}`);
  let overlay;
  if (type === "standard") {
    overlay = getEnhancementOverlay(tier);
  } else if (type === "set") {
    overlay = getEnhancementOverlay("IO");
  }

  return {
    enhancement,
    overlay,
  };
};

export const getArchetypeImage = (atName) => {
  return atImages("./" + atName.split(" ").join("_") + ".png");
};

export const getPowersetImage = (imageName) => {
  const name = imageName.imageName || imageName;
  return psImages(`./${name}`);
};
