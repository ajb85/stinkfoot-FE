import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BuildContext } from 'Providers/Builds.js';

import styles from './styles.module.scss';

function FilterOptions({ filters, toggleTag, setSearch }) {
  const { saveBuild } = useContext(BuildContext);
  return (
    <div className={styles.FilterButtons}>
      <div className={styles.filterContainer}>
        {/* Stats Buttons */}
        <div className={styles.statsContainer}>
          <label>Filter by Enhancement Stat</label>
          <div className={styles.statButtons}>
            {filters.options.map(o => {
              const isActive = !!filters.tags[o.name];
              const background = isActive ? o.activeColor : o.color;
              return (
                <button
                  key={o.name}
                  type="button"
                  style={{ background }}
                  onClick={toggleTag.bind(this, o.name)}
                >
                  {o.name}
                </button>
              );
            })}
          </div>
        </div>
        {/* Search Bar */}
        <div className={styles.searchBar}>
          <label>Filter by Keyword</label>
          <input value={filters.search} onChange={e => setSearch(e)} />
        </div>
        {/* New Build Button */}
        <div className={styles.buildOptions}>
          <button onClick={() => saveBuild()}>
            <FontAwesomeIcon icon={['fal', 'plus-circle']} />
            New Build
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterOptions;
