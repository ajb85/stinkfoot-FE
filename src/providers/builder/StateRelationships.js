// @flow

import * as React from "react";
import { useEffect } from "react";
import usePoolPowers from "./usePoolPowers.js";
import usePowerSlots from "./usePowerSlots.js";
import useActiveSets from "./useActiveSets.js";

import {
  useBuildAnalysis,
  useCanPoolBeAdded,
  useActivePowerset,
  usePowersets,
} from "hooks/powersets.js";

import { useNextActiveLevel } from "hooks/powersets.js";

export default function StateManager(props: {|
  children: React.Node,
|}): React.Node {
  const { powerSlots } = usePowerSlots();
  const { tracking, setTrackingManually } = useActiveSets();
  const { pools } = usePoolPowers();

  const details = useBuildAnalysis();
  const canPoolBeAdded = useCanPoolBeAdded();
  const activePool = useActivePowerset("poolPower");
  const allPools = usePowersets("poolPowers");

  const updateActiveLevel = useNextActiveLevel();

  useEffect(() => {
    // Update the active pool power based on changes in the build
    if (!canPoolBeAdded(activePool) && pools.length < 4) {
      const validPoolIndex = allPools.findIndex((p) => canPoolBeAdded(p));
      validPoolIndex >= 0 && setTrackingManually("poolPower", validPoolIndex);
    }
  }, [
    activePool,
    pools,
    details,
    canPoolBeAdded,
    allPools,
    setTrackingManually,
  ]);

  useEffect(() => {
    // Keep active level up to date
    updateActiveLevel();
  }, [powerSlots]); // eslint-disable-line
  return props.children;
}
