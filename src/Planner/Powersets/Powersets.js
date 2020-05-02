import React from 'react';

import Powerset from './Powerset.js';
import PoolPowers from './PoolPowers.js';

import { PlannerContext } from 'Providers/PlannerStateManagement.js';

import styles from './styles.module.scss';

function Powersets(props) {
  const stateManager = React.useContext(PlannerContext);
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
            updateBuild={stateManager.updateTracking}
          />
          <Powerset
            header="Secondary"
            dropdown={{
              name: 'secondaryIndex',
              list: stateManager.secondaries,
            }}
            powerList={stateManager.activeSecondary.powers}
            updateBuild={stateManager.updateTracking}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Powerset
              header="Epic Pool"
              dropdown={{
                name: 'epicPoolIndex',
                list: stateManager.epicPools,
              }}
              powerList={stateManager.activeEpicPool.powers}
              updateBuild={stateManager.updateTracking}
            />
            <PoolPowers />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Powersets;
