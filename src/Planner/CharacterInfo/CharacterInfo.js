import React from 'react';

import powersets from 'data/powersets.js';
import origins from 'data/origins.js';

import styles from './styles.module.scss';

function CharacterInfo({ stateManager }) {
  const { build, updateBuild } = stateManager;
  return (
    <section className={styles.CharacterInfo}>
      <div>
        <label>Archetype</label>
        <select
          value={build.archetype}
          name="archetype"
          onChange={(e) => updateBuild(e)}
        >
          {Object.keys(powersets).map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Origin</label>
        <select
          value={build.origin}
          name="origin"
          onChange={(e) => updateBuild(e)}
        >
          {origins.map((o) => (
            <option key={o.name} value={o.name}>
              {o.name}
            </option>
          ))}
        </select>
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
