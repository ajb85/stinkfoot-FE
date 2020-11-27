// @flow

import * as React, { useEffect } from "react";
import useEnhancementNavigation from "./useEnhancementNavigation";
import usePoolPowers from "./usePoolPowers.js";
import usePowerSlots from "./usePowerSlots.js";
import useActiveSets from "./useActiveSets.js";

import {
  useBuildAnalysis,
  useCanPoolBeAdded,
  useActivePowerset,
  usePowersets,
} from "hooks/powersets.js";

export default function StateManager(props: {|
  children: React.Node,
|}): React.Node {
  const {
    enhNavigation,
    viewEnhancementSubSection,
  } = useEnhancementNavigation();
  const { powerSlots } = usePowerSlots();
  const { tracking, setTrackingManually } = useActiveSets();
  const { pools } = usePoolPowers();

  const details = useBuildAnalysis();
  const canPoolBeAdded = useCanPoolBeAdded();
  const activePool = useActivePowerset("poolPower");
  const allPools = usePowersets("poolPowers");

  useEffect(() => {
    if (tracking.toggledSlot !== null) {
      // Update subsections of toggled enhancement to ensure it's always accurate
      const { setTypes } = powerSlots[tracking.toggledSlot].power;
      const isBrowsingIOSets = enhNavigation.section === "sets";
      viewEnhancementSubSection(isBrowsingIOSets ? setTypes[0] : "IO");
    }

    // eslint-disable-next-line
  }, [tracking.toggledSlot]);

  useEffect(() => {
    // Update the active pool power based on changes in the build
    if (!canPoolBeAdded(activePool) && pools.length < 4) {
      const validPoolIndex = allPools.findIndex((p) => canPoolBeAdded(p));
      validPoolIndex >= 0 && setTrackingManually("poolPower", validPoolIndex);
    }
  }, [activePool, pools, details, canPoolBeAdded]);

  return props.children;
}
