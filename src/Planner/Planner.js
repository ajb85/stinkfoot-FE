import React from 'react';

import CharacterInfo from './CharacterInfo/';
import Powersets from './Powersets/';
import PowerSlots from './PowerSlots/';

import styles from './styles.module.scss';

function Planner(props) {
  return (
    <div className={styles.Planner}>
      <header>
        <CharacterInfo />
      </header>
      <main>
        <Powersets />
        <PowerSlots />
      </main>
    </div>
  );
}

export default Planner;
