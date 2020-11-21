import enhancements from "data/enhancements.js";
import ioSets from "data/ioSets.js";

const allSets = Object.values(ioSets).reduce((acc, s) => [...acc, ...s], []);
const enhLookup = [...Object.values(enhancements.standard), ...allSets].reduce(
  (acc, e) => {
    const isStandard = e.type === "standard";
    const isSet = e.setType !== undefined;
    if (isStandard) {
      acc[e.displayName] = e;
      if (e.aliases) {
        e.aliases.forEach((a) => (acc[a] = e));
      }
    } else if (isSet) {
      const setLookup = {};
      e.enhancements.forEach((enh) => (setLookup[enh.displayName] = enh));

      acc[e.displayName] = setLookup;
    } else {
      console.log("UNKNOWN ENHANCEMENT TYPE", e);
    }
    return acc;
  },
  {}
);

console.log("LOOKUP: ", enhLookup);

export default function (name, type) {
  if (type === "ioSet") {
    const [set, enhName] = name.split(" // ");
    const enhancement = enhLookup[set] && enhLookup[set][enhName];
    if (!enhancement) {
      const noSet = !enhLookup[set];
      console.log(
        noSet ? "COULD NOT FIND SET " : "COULD NOT FIND ENHANCEMENT",
        name,
        type
      );
    }

    return enhancement;
  } else if (type === "SO" || type === "IO") {
    const enhancement = enhLookup[name];
    if (!enhancement) {
      console.log("COULD NOT FIND STANDARD ENHANCEMENT: ", name, type);
    }

    return enhancement;
  } else {
    console.log("COULD NOT FIND ENHANCEMENT: ", name, type);
  }
  return;
}
