import React from 'react';

import styles from '../styles.module.scss';

function StandardEnhancementMenu(props) {
  // const stateManager = React.useContext(PlannerContext);
  // console.log('ENHANCEMENT: ', props.enhancement);
  const { displayName } = props.enhancement;

  return (
    <div className={styles.EnhHoverMenu}>
      <div className={styles.menu}>
        <h2>{displayName}</h2>
      </div>
    </div>
  );
}

export default StandardEnhancementMenu;
