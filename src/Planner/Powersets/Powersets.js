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
              name: "primary",
              list: usePowersets("primaries"),
            }}
            powerList={useActivePowerset("primary").powers}
          />
          <Powerset
            header="Secondary"
            dropdown={{
              name: "secondary",
              list: usePowersets("secondaries"),
            }}
            powerList={useActivePowerset("secondary").powers}
          />
          <Powerset
            header="Epic Pool"
            dropdown={{
              name: "epicPool",
              list: usePowersets("epicPools"),
            }}
            powerList={useActivePowerset("epicPool").powers}
          />
        </div>
        <PoolPowers />
      </div>
    </section>
  );
}

export default Powersets;
