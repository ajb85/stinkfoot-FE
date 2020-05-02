import React from 'react';

import Dropdown from 'Planner/UI/Dropdown/';

import { PlannerContext } from 'Providers/PlannerStateManagement.js';
import styles from './styles.module.scss';

function CharacterInfo(props) {
  const stateManager = React.useContext(PlannerContext);

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
        <Dropdown
          selected={stateManager.archetype}
          name="archetype"
          onChange={(e) => updateBuild(e)}
          options={atOptions}
        />
      </div>
      <div>
        <label>Origin</label>
        <Dropdown
          selected={stateManager.origin}
          name="origin"
          onChange={(e) => updateBuild(e)}
          options={stateManager.origins.map(({ name }) => ({
            value: name,
            display: name,
            image: stateManager.getOriginImage(name),
          }))}
        />
      </div>{' '}
      <div>
        <label>Name</label>
        <input
          type="text"
          value={stateManager.buildName}
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
