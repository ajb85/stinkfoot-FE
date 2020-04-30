import React from 'react';

import Powerset from './Powerset.js';
import PoolPowers from './PoolPowers.js';

import styles from './styles.module.scss';

function Powersets({ stateManager }) {
  return (
    <section className={styles.Powersets}>
      <div>
        <div className={styles.powersetContainer}>
          <Powerset
            header="Primary"
            dropdown={{
              name: 'primaryIndex',
              list: stateManager.primaries,
            }}
            powerList={stateManager.activePrimary.powers}
            stateManager={stateManager}
          />
          <Powerset
            header="Secondary"
            dropdown={{
              name: 'secondaryIndex',
              list: stateManager.secondaries,
            }}
            powerList={stateManager.activeSecondary.powers}
            stateManager={stateManager}
          />
          <PoolPowers stateManager={stateManager} />
          <Powerset
            header="Epic Pool"
            dropdown={{
              name: 'epicPoolIndex',
              list: stateManager.epicPools,
            }}
            powerList={stateManager.activeEpicPool.powers}
            stateManager={stateManager}
          />
        </div>
      </div>
    </section>
  );
}

export default Powersets;
