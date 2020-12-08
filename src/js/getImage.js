// @flow
import allOrigins from "data/origins.js";

const images: {
  [key: string]: { [key: string]: { default: string } },
} = { root: {} };

function importAll(r: function): void {
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
      images.root[fileName] = r(key);
    }
  });
}

importAll(require.context("../assets/cohImages", true, /\.png$/));

export default function getImage(filePathInCoHAssets: string): string {
  const [dir, fileName] = filePathInCoHAssets.split("/");

  const folder = dir ? images[dir] : images.root;
  const fileToRetrieve = folder[fileName] ? fileName : null;

  if (!(fileToRetrieve && folder[fileToRetrieve])) {
    console.log(
      "IMAGE NOT FOUND: ",
      filePathInCoHAssets,
      dir,
      fileName,
      images
    );
  }

  return fileToRetrieve && folder[fileToRetrieve]
    ? folder[fileToRetrieve].default
    : images.root["Unknown.png"].default;
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
