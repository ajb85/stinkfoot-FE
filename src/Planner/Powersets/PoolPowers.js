import React from 'react';

import Powerset from './Powerset.js';

// import styles from './styles.module.scss';

function PoolPowers({ stateManager }) {
  const { build } = stateManager;
  return (
    <div>
      <h2>Power Pools</h2>
      {build.poolPowers.map((pool) => {
        return (
          <React.Fragment key={pool}>
            <Powerset
              header={pool}
              powerList={stateManager.activePrimary.powers}
              stateManager={stateManager}
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
        />
      )}
    </div>
  );
}

export default PoolPowers;
