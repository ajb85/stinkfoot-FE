import allOrigins from "data/origins.js";
import mockRequireContext from "testTools/mockRequireContext.js";
require = mockRequireContext(require);
const overlayImages = require.context("./images/overlays/", true);

const atImages = require.context("./images/archetypes/", true);
const psImages = require.context("./images/powersets/", true);

export const getOriginImage = (originName) => {
  const oImages = require.context("./images/origins/", true);
  return oImages(`./${originName}.png`).default;
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

export const getArchetypeImage = (atName) => {
  return atImages("./" + atName.split(" ").join("_") + ".png").default;
};

export const getPowersetImage = (imageName) => {
  const name = imageName.imageName || imageName;
  return psImages(`./${name}`).default;
};
