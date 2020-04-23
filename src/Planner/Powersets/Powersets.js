import React from 'react';

import Powerset from './Powerset.js';
import PoolPowers from './PoolPowers.js';

import styles from './styles.module.scss';

function Powersets({ build, updateBuild, togglePower, addPowerFromNewPool }) {
  return (
    <section className={styles.Powersets}>
      <div>
        <div className={styles.powersetContainer}>
          <Powerset
            header="Primary"
            order="primary"
            build={build}
            updateBuild={updateBuild}
            togglePower={togglePower}
            renderSelect={true}
          />
          <Powerset
            header="Secondary"
            order="secondary"
            build={build}
            updateBuild={updateBuild}
            togglePower={togglePower}
            renderSelect={true}
          />
          <PoolPowers
            build={build}
            updateBuild={updateBuild}
            togglePower={togglePower}
            addPowerFromNewPool={addPowerFromNewPool}
          />
        </div>
      </div>
    </section>
  );
}

export default Powersets;
