import React from "react";

import Dropdown from "components/Dropdown";

import { useSwitchArchetype } from "hooks/powersets.js";
import useCharacterDetails from "providers/builder/useCharacterDetails.js";
import { getArchetypeImage, getOriginImage } from "helpers/getImages.js";

import allOrigins from "data/origins.js";
import allArchetypes from "data/archetypes.js";

import styles from "./styles.module.scss";

const atOptions = allArchetypes.map((a) => ({
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
  const { character, setCharacterDetail } = useCharacterDetails();
  const switchArchetype = useSwitchArchetype();

  return (
    <section className={styles.CharacterInfo}>
      <div>
        <label>Archetype</label>
        <div style={{ width: 140 }}>
          <Dropdown
            selected={character.archetype}
            name="archetype"
            onChange={switchArchetype}
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
            onChange={setCharacterDetail}
            options={originOptions}
          />
        </div>
      </div>
      {/* <div>
        <label>Name</label>
        <input
          type="text"
          value={character.name}
          name="name"
          onChange={setCharacterDetail}
        />
      </div> */}
    </section>
  );
}

export default CharacterInfo;
