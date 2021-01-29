// @flow
import allOrigins from "../data/origins.js";
import images from "./images.js";
console.log("IMAGES: ", images);

export default function getImage(filePathInCoHAssets: string): string {
  const [dir, fileName] = filePathInCoHAssets.split("/");
  const extension = fileName && fileName.indexOf(".") === -1 ? ".png" : "";

  const folder = dir ? images[dir] : images.root;
  const file = (folder && folder[fileName + extension]) || null;
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

const statToFileName: { [string]: string } = {
  Immob: "Immobilize.png",
  Hold: "Hold.png",
  Stun: "Stun.png",
  Sleep: "Sleep.png",
  Terror: "Fear.png",
  Confuse: "Confuse.png",
  "Run Speed": "Run.png",
  "Recharge Time": "Recharge.png",
  "Flight Speed": "Fly.png",
};

export const getImageForStat = (stat: string): string | null => {
  return statToFileName[stat]
    ? getImage("enhancements/" + statToFileName[stat])
    : null;
};
