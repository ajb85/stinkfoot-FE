import React from "react";

import Powerset from "./Powerset.js";
import PoolPowers from "./PoolPowers.js";

import usePlannerState from "providers/usePlannerState.js";

import styles from "./styles.module.scss";

function Powersets(props) {
  const stateManager = usePlannerState();
  return (
    <section className={styles.Powersets}>
      <div className={styles.powersetContainer}>
        <h2>{stateManager.getFromState("archetype")} Powersets</h2>
        <div>
          <Powerset
            header="Primary"
            dropdown={{
              name: "primaryIndex",
              list: stateManager.primaries,
            }}
            powerList={stateManager.activePrimary.powers}
            updateBuild={stateManager.updateTracking}
          />
          <Powerset
            header="Secondary"
            dropdown={{
              name: "secondaryIndex",
              list: stateManager.secondaries,
            }}
            powerList={stateManager.activeSecondary.powers}
            updateBuild={stateManager.updateTracking}
          />
          <Powerset
            header="Epic Pool"
            dropdown={{
              name: "epicPoolIndex",
              list: stateManager.epicPools,
            }}
            powerList={stateManager.activeEpicPool.powers}
            updateBuild={stateManager.updateTracking}
          />
        </div>
        <PoolPowers />
      </div>
    </section>
  );
}

export default Powersets;
