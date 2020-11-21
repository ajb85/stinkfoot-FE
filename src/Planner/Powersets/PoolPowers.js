import React from "react";

import Powerset, { createFilteredOptionsList } from "./Powerset.js";
import {
  useSelectedPools,
  useActivePowerset,
  useAddPowerFromNewPool,
  useCanPoolBeAdded,
} from "hooks/powersets.js";

import { stopProp } from "js/utility.js";
import allPools from "data/poolPowers.js";
import styles from "./styles.module.scss";

function PoolPowers(props) {
  const selectedPoolPowers = useSelectedPools();
  const activePool = useActivePowerset("poolPower");
  const addPowerFromNewPool = useAddPowerFromNewPool();
  const canPoolBeAdded = useCanPoolBeAdded();
  const list = createFilteredOptionsList(canPoolBeAdded, allPools);

  return (
    <div className={styles.PoolPowers} onClick={stopProp}>
      <h2>Power Pools</h2>
      <div>
        {/* Render selected pool powers */}
        {selectedPoolPowers.map((pool) => (
          <Powerset
            key={pool.poolIndex}
            header={pool.displayName}
            powerList={pool.powers}
            poolIndex={pool.poolIndex}
            compact
          />
        ))}

        {/* Render new power pool selection */}
        {selectedPoolPowers.length < 4 && (
          <Powerset
            dropdown={{ name: "poolPower", list }}
            powerList={activePool.powers}
            togglePower={addPowerFromNewPool}
            compact
          />
        )}

        {renderEmptyBoxes(selectedPoolPowers)}
      </div>
    </div>
  );
}

const renderEmptyBoxes = (selectedPoolPowers) => {
  const emptyBoxes = [];

  for (let i = selectedPoolPowers.length; i < 3; i++) {
    // Must only be a total of 4 boxes.  There are the selected pools &
    // the extra box to select a new pool to consider.  That means, when
    // there are three pools selected, no empty boxes should render

    emptyBoxes.push(<div key={`empty box ${i}`} className={styles.emptyBox} />);
  }

  return emptyBoxes;
};

export default PoolPowers;
