// @flow
import type { Enhancement, IOSet } from "flow/types.js";
import {
  standardLookupByDisplayName as standardLookup,
  setLookupByDisplayName as setLookup,
} from "data/enhancements.js";

type ArrayOfSets = Array<IOSet>;

type StandardAccumulator = { [key: string]: Enhancement };
type SetAccumulator = { [key: string]: IOSet };

export default function getEnhancementFromName(
  name: string,
  type: string
): Enhancement | void {
  if (type === "ioSet") {
    const [set, enhName] = name.split(" // ");
    const enhancement = setLookup[set] && setLookup[set][enhName];
    if (!enhancement) {
      const noSet = !setLookup[set];
      console.log(
        noSet ? "COULD NOT FIND SET " : "COULD NOT FIND ENHANCEMENT",
        name,
        type
      );
    }

    return enhancement;
  } else if (type === "SO" || type === "IO") {
    const enhancement = standardLookup[name];
    if (!enhancement) {
      console.log("COULD NOT FIND STANDARD ENHANCEMENT: ", name, type);
    }

    return enhancement;
  } else {
    console.log("COULD NOT FIND ENHANCEMENT: ", name, type);
  }
  return;
}
