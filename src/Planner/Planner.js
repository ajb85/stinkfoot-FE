import React, { useState } from 'react';

import CharacterInfo from './CharacterInfo/';
import Powersets from './Powersets/';
import PowerSlots from './PowerSlots/';

import buildManager from 'js/buildManager.js';

import styles from './styles.module.scss';

function Planner(props) {
  const [build, setBuild] = useState(buildManager.initialState());

  const stateManager = new buildManager(build, setBuild);

  console.log('BUILD: ', stateManager.build);

  return (
    <div className={styles.Planner}>
      <header>
        <CharacterInfo stateManager={stateManager} />
      </header>
      <main>
        <Powersets stateManager={stateManager} />
        <PowerSlots stateManager={stateManager} />
      </main>
    </div>
  );
}

export default Planner;
