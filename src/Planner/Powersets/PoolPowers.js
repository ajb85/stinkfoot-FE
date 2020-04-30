import React from 'react';

import Powerset from './Powerset.js';

import styles from './styles.module.scss';

function PoolPowers({ stateManager }) {
  const { build } = stateManager;
  return (
    <div className={styles.PoolPowers}>
      <h2>Power Pools</h2>
      {build.poolPowers.map((poolIndex) => {
        return (
          <React.Fragment key={poolIndex}>
            <Powerset
              header={stateManager.pools[poolIndex].displayName}
              powerList={stateManager.pools[poolIndex].powers}
              stateManager={stateManager}
              poolIndex={poolIndex}
            />
          </React.Fragment>
        );
      })}

      {build.poolPowers.length < 4 && (
        <Powerset
          dropdown={{
            name: 'poolPowerIndex',
            list: stateManager.pools,
          }}
          powerList={stateManager.activePool.powers}
          build={build}
          stateManager={stateManager}
          togglePower={stateManager.addPowerFromNewPool}
        />
      )}
    </div>
  );
}

export default PoolPowers;
