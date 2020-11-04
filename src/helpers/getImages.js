import allOrigins from "data/origins.js";

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

export const getEnhancementOverlay = (origin, tier) => {
  // getEnhancementOverlay
  const oData = allOrigins.find((o) => o.name === origin);

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

export const getEnhancementImageWithOverlay = (
  origin,
  { imageName, tier, type }
) => {
  // getEnhancementAndOverlayImages
  console.log("IMAGE NAME: ", imageName);
  const enhancement = enhImages(`./${imageName}`);
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
  return atImages("./" + atName.split(" ").join("_") + ".png");
};

export const getPowersetImage = (imageName) => {
  const name = imageName.imageName || imageName;
  return psImages(`./${name}`);
};
