import React from 'react';

import styles from './styles.module.scss';

function FilterOptions({ filters, toggleTag, setSearch }) {
  return (
    <div className={styles.FilterButtons}>
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
      <div className={styles.searchBar}>
        <label>Filter by Keyword</label>
        <input value={filters.search} onChange={e => setSearch(e)} />
      </div>
    </div>
  );
}

export default FilterOptions;
