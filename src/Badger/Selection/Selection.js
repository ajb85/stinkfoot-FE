import React from 'react';

import { useBadges } from 'Providers/Badges.js';
import { badgeTypes } from '../data/';

function Selection({ section, updateSection, searchState }) {
  const { badges } = useBadges();
  // const [search, setSearch] = searchState;
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
      {/* <input type="text" value={search} onChange={saveSearch(setSearch)} /> */}
    </div>
  );
}

// const saveSearch = (setSearch) => (e) => setSearch(e.target.value);

export default Selection;
