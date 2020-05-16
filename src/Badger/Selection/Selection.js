import React from 'react';

import { useBadges } from 'Providers/Badges.js';
import { badgeTypes } from '../data/';

function Selection({ section, updateSection, filterState }) {
  const { badges } = useBadges();
  const [filters] = filterState;

  return (
    <div>
      {badges.active && Object.keys(badges.characters).length > 0 && (
        <select value={section} onChange={updateSection}>
          {badgeTypes.map(({ display, code }) => (
            <option key={code} value={code}>
              {display}
            </option>
          ))}
        </select>
      )}
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
