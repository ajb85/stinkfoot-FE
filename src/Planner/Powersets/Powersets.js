import React from "react";

import Powerset, { createFilteredOptionsList } from "./Powerset.js";
import { useCanPowersetBeAdded } from "hooks/powersets.js";
import PoolPowers from "./PoolPowers.js";

import useCharacterDetails from "providers/builder/useCharacterDetails.js";
import {
  usePowersets,
  useActivePowerset,
  useChangePowerset,
} from "hooks/powersets";

import styles from "./styles.module.scss";

function Powersets(props) {
  const { character } = useCharacterDetails();
  const canPowersetBeAdded = useCanPowersetBeAdded();
  const filterList = createFilteredOptionsList.bind(this, canPowersetBeAdded);
  const changePowerset = useChangePowerset();
  return (
    <section className={styles.Powersets}>
      <div className={styles.powersetContainer}>
        <h2>{character.archetype} Powersets</h2>
        <div>
          <Powerset
            header="Primary"
            dropdown={{
              name: "primary",
              list: filterList(usePowersets("primaries")),
            }}
            powerList={useActivePowerset("primary").powers}
            onChange={changePowerset}
          />
          <Powerset
            header="Secondary"
            dropdown={{
              name: "secondary",
              list: filterList(usePowersets("secondaries")),
            }}
            powerList={useActivePowerset("secondary").powers}
            onChange={changePowerset}
          />
          <Powerset
            header="Epic Pool"
            dropdown={{
              name: "epicPool",
              list: filterList(usePowersets("epicPools")),
            }}
            powerList={useActivePowerset("epicPool").powers}
            onChange={changePowerset}
          />
        </div>
        <PoolPowers />
      </div>
    </section>
  );
}

export default Powersets;
