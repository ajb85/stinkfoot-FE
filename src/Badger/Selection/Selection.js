import React from 'react';

import { badgeTypes } from '../data/';

function Selection({ section, updateSection, searchState }) {
  const [search, setSearch] = searchState;
  return (
    <div>
      <select value={section} onChange={updateSection}>
        {badgeTypes.map(({ display, code }) => (
          <option key={code} value={code}>
            {display}
          </option>
        ))}
      </select>
      <input type="text" value={search} onChange={saveSearch(setSearch)} />
    </div>
  );
}

const saveSearch = (setSearch) => (e) => setSearch(e.target.value);

export default Selection;
