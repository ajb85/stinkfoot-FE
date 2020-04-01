import React from 'react';

import styles from './styles.module.scss';

function FilterOptions({ filters, toggleTag }) {
  console.log('FILTESR: ', filters);
  return (
    <div className={styles.FilterButtons}>
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
  );
}

export default FilterOptions;
