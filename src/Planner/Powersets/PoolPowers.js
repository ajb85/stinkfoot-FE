import React from "react";

import Powerset from "./Powerset.js";

import usePlannerState from "hooks/usePlannerState.js";

import styles from "./styles.module.scss";

function PoolPowers(props) {
  const stateManager = usePlannerState();

  const renderEmptyBoxes = () => {
    const emptyBoxes = [];

    for (let i = stateManager.selectedPoolPowers.length; i < 3; i++) {
      // Must only be a total of 4 boxes.  There are the selected pools &
      // the extra box to select a new pool to consider.  That means, when
      // there are three pools selected, no empty boxes should render

      emptyBoxes.push(
        <div key={`empty box ${i}`} className={styles.emptyBox} />
      );
    }

    return emptyBoxes;
  };
  return (
    <div className={styles.PoolPowers}>
      <h2>Power Pools</h2>
      <div>
        {stateManager.selectedPoolPowers.map((poolIndex) => {
          return (
            <React.Fragment key={poolIndex}>
              <Powerset
                header={stateManager.pools[poolIndex].displayName}
                powerList={stateManager.pools[poolIndex].powers}
                poolIndex={poolIndex}
                compact={true}
              />
            </React.Fragment>
          );
        })}

        {stateManager.selectedPoolPowers.length < 4 && (
          <Powerset
            dropdown={{
              name: "poolPowerIndex",
              list: stateManager.pools,
            }}
            powerList={stateManager.activePool.powers}
            togglePower={stateManager.addPowerFromNewPool}
            updateBuild={stateManager.updateTracking}
            compact={true}
          />
        )}

        {renderEmptyBoxes()}
      </div>
    </div>
  );
}

export default PoolPowers;
