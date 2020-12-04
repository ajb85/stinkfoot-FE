import allOrigins from "data/origins.js";
const images = {};

function importAll(r) {
  r.keys().forEach((key) => {
    const split = key.substring(2).split("/");
    const hasDir = split.length > 1;

    if (hasDir) {
      const [dir, fileName] = split;

      if (!images[dir]) {
        images[dir] = {};
      }

      images[dir][fileName] = r(key);
    } else {
      const [fileName] = split;
      images[fileName] = r(key);
    }
  });
}

importAll(require.context("../assets/cohImages", true, /\.png$/));

export default function getImage(filePathInCoHAssets) {
  const [dir, fileName] = filePathInCoHAssets.split("/");

  const folder = dir ? images[dir] : images;
  return folder[fileName]
    ? folder[fileName].default
    : images["Unknown.png"].default;
}

export const getEnhancementOverlay = (origin, tier) => {
  // getEnhancementOverlay
  const oData = allOrigins.find((o) => o.name === origin);
  switch (tier) {
    case "IO":
      return images.overlays["IO.png"].default;
    case "TO":
      return images.overlays["TO.png"].default;
    case "SO":
    case "DO":
      return images.overlays[`${oData[tier]}.png`].default;
    default:
      return null;
  }
};
