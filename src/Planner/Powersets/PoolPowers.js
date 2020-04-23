import React from 'react';

import Powerset from './Powerset.js';

// import styles from './styles.module.scss';

function PoolPowers({ build, togglePower, updateBuild, addPowerFromNewPool }) {
  return (
    <div>
      <h2>Power Pools</h2>
      {build.poolPowers.map((pool) => {
        return (
          <React.Fragment key={pool}>
            <Powerset
              header={pool}
              order="poolPower"
              build={build}
              togglePower={togglePower}
            />
          </React.Fragment>
        );
      })}

      {build.poolPowers.length < 4 && (
        <Powerset
          order="poolPower"
          build={build}
          updateBuild={updateBuild}
          togglePower={addPowerFromNewPool}
          renderSelect={true}
        />
      )}
    </div>
  );
}

export default PoolPowers;
