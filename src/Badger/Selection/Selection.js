import React from 'react';

import { badgeTypes } from '../data/';

function Selection({ section, updateSection, filterState }) {
  const [filters] = filterState;

  return (
    <div>
      <select value={section} onChange={updateSection}>
        {badgeTypes.map(({ display, code }) => (
          <option key={code} value={code}>
            {display}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={filters.search}
        onChange={saveSearch(filterState)}
        placeholder="Search for badge"
      />
      <button type="button" onClick={toggleShowComplete(filterState)}>
        {filters.showCompleted ? 'Showing Completed' : 'Hiding Completed'}
      </button>
    </div>
  );
}

const saveSearch = ([filters, setFilters]) => (e) =>
  setFilters({ ...filters, search: e.target.value });

const toggleShowComplete = ([filters, setFilters]) => () =>
  setFilters({ ...filters, showCompleted: !filters.showCompleted });

export default Selection;
