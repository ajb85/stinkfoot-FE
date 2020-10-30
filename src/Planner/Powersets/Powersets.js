import React from "react";

import Powerset from "./Powerset.js";
import PoolPowers from "./PoolPowers.js";

import useCharacterDetails from "providers/builder/useCharacterDetails.js";
import { usePowersets, useActivePowerset } from "hooks/powersets";

import styles from "./styles.module.scss";

function Powersets(props) {
  const { character } = useCharacterDetails();

  return (
    <section className={styles.Powersets}>
      <div className={styles.powersetContainer}>
        <h2>{character.archetype} Powersets</h2>
        <div>
          <Powerset
            header="Primary"
            dropdown={{
              name: "primaryIndex",
              list: usePowersets("primaries"),
            }}
            powerList={useActivePowerset("primaries").powers}
          />
          <Powerset
            header="Secondary"
            dropdown={{
              name: "secondaryIndex",
              list: usePowersets("secondaries"),
            }}
            powerList={useActivePowerset("secondaries").powers}
          />
          <Powerset
            header="Epic Pool"
            dropdown={{
              name: "epicPoolIndex",
              list: usePowersets("epicPools"),
            }}
            powerList={useActivePowerset("epicPools").powers}
          />
        </div>
        <PoolPowers />
      </div>
    </section>
  );
}

export default Powersets;
