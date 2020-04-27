import React from 'react';

import Powerset from './Powerset.js';
import PoolPowers from './PoolPowers.js';

import styles from './styles.module.scss';

function Powersets({ stateManager }) {
  const { build } = stateManager;
  return (
    <section className={styles.Powersets}>
      <div>
        <div className={styles.powersetContainer}>
          <Powerset
            header="Primary"
            dropdown={{
              value: stateManager.activePrimary.displayName,
              name: 'primary',
              list: extractDisplayNames(stateManager.primaries),
            }}
            powerList={filterPowers(build, stateManager.activePrimary.powers)}
            stateManager={stateManager}
          />
          <Powerset
            header="Secondary"
            dropdown={{
              value: stateManager.activeSecondary.displayName,
              name: 'secondary',
              list: extractDisplayNames(stateManager.secondaries),
            }}
            powerList={filterPowers(build, stateManager.activeSecondary.powers)}
            stateManager={stateManager}
          />
          {/* <PoolPowers
            build={build}
            updateBuild={updateBuild}
            togglePower={togglePower}
            addPowerFromNewPool={addPowerFromNewPool}
          /> */}
        </div>
      </div>
    </section>
  );
}

function extractDisplayNames(list) {
  return list.map(({ displayName }) => displayName);
}

function filterPowers(build, powers) {
  return powers.filter(
    ({ fullName }) =>
      !build.excludedPowersets[fullName] &&
      !build.poolPowers.find((name) => fullName === name)
  );
}

export default Powersets;
