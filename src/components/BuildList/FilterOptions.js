import React from "react";

import useCharacters from "providers/useCharacters.js";

import styles from "./styles.module.scss";

function FilterOptions({ filters, toggleTag, setSearch, zIndex = 10000 }) {
  const { saveBuild } = useCharacters();
  return (
    <div style={{ zIndex }} className={styles.FilterButtons}>
      <div className={styles.filterContainer}>
        {/* Stats Buttons */}
        <div className={styles.statsContainer}>
          <label>Filter by Enhancement Stat</label>
          <div className={styles.statButtons}>
            {filters.options.map((o) => {
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
          <input value={filters.search} onChange={(e) => setSearch(e)} />
        </div>
        {/* New Build Button */}
        <div className={styles.buildOptions}>
          <button onClick={() => saveBuild()}>
            <p>ICON</p>
            New Build
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterOptions;
