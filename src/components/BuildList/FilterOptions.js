import React from 'react';

import styles from './styles.module.scss';

function FilterOptions({ filters, toggleTag }) {
  return (
    <div className={styles.FilterButtons}>
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
  );
}

export default FilterOptions;
