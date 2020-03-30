import React, { useContext } from 'react';

import { BuildContext } from 'Providers/Builds.js';

import styles from './styles.module.scss';

function ListBuild(props) {
  const { build } = useContext(BuildContext);
  return (
    <div className={styles.BuildList}>
      {Object.entries(build).map(([setName, enhancements]) => {
        const allEnhancements = [];
        for (let e in enhancements) {
          const count = enhancements[e];
          allEnhancements.push({ name: e, count });
        }
        return (
          <div key={setName} className={styles.set}>
            <h2>{setName}</h2>
            <div className={styles.enhancements}>
              {allEnhancements.map(({ name, count }) => (
                <p key={name}>
                  {name}: {count}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ListBuild;
