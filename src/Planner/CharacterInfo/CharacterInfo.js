import React from "react";

import Dropdown from "components/Dropdown";
import usePlannerState from "providers/usePlannerState.js";

import { archetypes } from "hooks/powersets.js";
import { useCharacterDetails } from "providers/builder/useCharacterDetails.js";
import { getArchetypeImage, getOriginImage } from "helpers/getImages.js";
import { allOrigins } from "hooks/powersets.js";

import styles from "./styles.module.scss";

const atOptions = archetypes.map((a) => ({
  value: a,
  display: a,
  image: getArchetypeImage(a),
}));

const originOptions = allOrigins.map(({ name }) => ({
  value: name,
  display: name,
  image: getOriginImage(name),
}));

function CharacterInfo(props) {
  const { character } = useCharacterDetails();

  return (
    <section className={styles.CharacterInfo}>
      <div>
        <label>Archetype</label>
        <div style={{ width: 140 }}>
          <Dropdown
            selected={character.archetype}
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
            selected={character.origin}
            name="origin"
            onChange={updateBuild}
            options={originOptions}
          />
        </div>
      </div>
      <div>
        <label>Name</label>
        <input
          type="text"
          value={character.name}
          name="name"
          onChange={updateBuild}
        />
      </div>
    </section>
  );
}

export default CharacterInfo;
