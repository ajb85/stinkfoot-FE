import React from 'react';

import Powerset from './Powerset.js';
import { PlannerContext } from 'Providers/PlannerStateManagement.js';

import styles from './styles.module.scss';

function PoolPowers(props) {
  const stateManager = React.useContext(PlannerContext);

  return (
    <div className={styles.PoolPowers}>
      <h2>Power Pools</h2>
      {stateManager.selectedPoolPowers.map((poolIndex) => {
        return (
          <React.Fragment key={poolIndex}>
            <Powerset
              header={stateManager.pools[poolIndex].displayName}
              powerList={stateManager.pools[poolIndex].powers}
              poolIndex={poolIndex}
            />
          </React.Fragment>
        );
      })}

      {stateManager.selectedPoolPowers.length < 4 && (
        <Powerset
          dropdown={{
            name: 'poolPowerIndex',
            list: stateManager.pools,
          }}
          powerList={stateManager.activePool.powers}
          togglePower={stateManager.addPowerFromNewPool}
        />
      )}
    </div>
  );
}

export default PoolPowers;
