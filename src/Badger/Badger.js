import React, { useState } from 'react';

import ManageCharacter from './ManageCharacter/';
import Selection from './Selection/';
import BadgeList from './BadgeList/';

import { badgeTypes } from './data/';

import styles from './styles.module.scss';

function Badger(props) {
  const lastSection = localStorage.getItem('activeBadgeSection');
  const [section, setSection] = useState(
    lastSection ? JSON.parse(lastSection) : null
  );

  const searchState = useState('');

  React.useEffect(() => {
    if (!section) {
      setSection(badgeTypes[0].code);
      saveLocal(badgeTypes[0].code);
    }
  }, [section]);

  return (
    <div className={styles.Badger}>
      <ManageCharacter />
      <Selection
        section={section}
        updateSection={saveActiveSection(setSection)}
        searchState={searchState}
      />
      <BadgeList section={section} search={searchState[0]} />
    </div>
  );
}

const saveActiveSection = (setSection) => (e) => {
  console.log('EFK: ', e.target.value);
  saveLocal(e.target.value);
  setSection(e.target.value);
};

const saveLocal = (data) =>
  localStorage.setItem('activeBadgeSection', JSON.stringify(data));
export default Badger;
