import React from "react";

import Dropdown from "components/Dropdown";

import usePlannerState from "hooks/usePlannerState.js";
import styles from "./styles.module.scss";

function CharacterInfo(props) {
  const stateManager = usePlannerState();

  const { updateBuild, archetypes } = stateManager;
  const atOptions = archetypes.map((a) => ({
    value: a,
    display: a,
    image: stateManager.getArchetypeImage(a),
  }));

  return (
    <section className={styles.CharacterInfo}>
      <div>
        <label>Archetype</label>
        <div style={{ width: 140 }}>
          <Dropdown
            selected={stateManager.archetype}
            name="archetype"
            onChange={updateBuild}
            options={atOptions}
          />
        </div>
      </div>
      <div>
        <label>Origin</label>
        <div style={{ width: 140 }}>
          <Dropdown
            selected={stateManager.origin}
            name="origin"
            onChange={updateBuild}
            options={stateManager.origins.map(({ name }) => ({
              value: name,
              display: name,
              image: stateManager.getOriginImage(name),
            }))}
          />
        </div>
      </div>
      <div>
        <label>Name</label>
        <input
          type="text"
          value={stateManager.buildName}
          name="name"
          onChange={updateBuild}
        />
      </div>
    </section>
  );
}

export default CharacterInfo;
