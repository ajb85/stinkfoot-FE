import React from 'react';

import Dropdown from 'Planner/UI/Dropdown/';

import origins from 'data/origins.js';

import styles from './styles.module.scss';

function CharacterInfo({ stateManager }) {
  const { build, updateBuild, archetypes } = stateManager;
  const atImages = require.context('Planner/images/archetypes', true);
  const oImages = require.context('Planner/images/origins', true);
  const atOptions = archetypes.map((a) => ({
    value: a,
    display: a,
    image: atImages('./' + a.split(' ').join('_') + '.png'),
  }));
  return (
    <section className={styles.CharacterInfo}>
      <div>
        <label>Archetype</label>
        <Dropdown
          selected={build.archetype}
          name="archetype"
          onChange={(e) => updateBuild(e)}
          options={atOptions}
        />
      </div>
      <div>
        <label>Origin</label>
        <Dropdown
          selected={build.origin}
          name="origin"
          onChange={(e) => updateBuild(e)}
          options={origins.map(({ name }) => ({
            value: name,
            display: name,
            image: oImages(`./${name}.png`),
          }))}
        />
      </div>{' '}
      <div>
        <label>Name</label>
        <input
          type="text"
          value={build.name}
          name="name"
          onChange={(e) => updateBuild(e)}
        />
      </div>
      {/* <div>
        <button type="text" onClick={toggleAlignment}>
          {build.alignment}
        </button>
      </div> */}
    </section>
  );
}

export default CharacterInfo;
