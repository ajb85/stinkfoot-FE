// @flow
import allOrigins from "../data/origins.js";
import images from "./images.js";

export default function getImage(filePathInCoHAssets: string): string {
  const [dir, fileName] = filePathInCoHAssets.split("/");
  const extension = fileName.indexOf(".") === -1 ? ".png" : "";

  const folder = dir ? images[dir] : images.root;
  const file = folder[fileName + extension] || null;
  return file ? file.default : images.root["Unknown.png"].default;
}

export const getEnhancementOverlay = (origin: string, tier: string): string => {
  const oData = allOrigins.find((o) => o.name === origin);
  switch (tier) {
    case "IO":
      return getImage("overlays/IO.png");
    case "TO":
      return getImage("overlays/TO.png");
    case "SO":
    case "DO":
      return getImage(`overlays/${oData[tier]}.png`);
    default:
      return images.root["Unknown.png"].default;
  }
};
