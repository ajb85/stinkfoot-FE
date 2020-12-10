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

const isTest = process.env.NODE_ENV === "test";
if (!isTest) {
  importAll(require.context("../assets/cohImages", true, /\.png$/));
}

const dirHandler = {
  get: () => require("../assets/cohImages/Unknown.png"),
};
const imagesHandler = {
  get: () => new Proxy({}, dirHandler),
};

export default isTest ? new Proxy(images, imagesHandler) : images;
