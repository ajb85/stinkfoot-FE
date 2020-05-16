import React from 'react';

import { useBadges } from 'Providers/Badges.js';

import styles from './styles.module.scss';

function BadgeList({ section, search }) {
  const { badges, character } = useBadges();
  console.log('B', badges);
  const badgeList = badges.characters[badges.active][section].filter(
    filterSearch(search)
  );

  const { bonusNotes, location, zone } = badgeList[0];

  return (
    <div className={styles.BadgeList}>
      <div className={styles.row}>
        <h3>Availability</h3>
        <h3 className={styles.name}>Name</h3>
        {location && <h3 className={styles.location}>Location</h3>}
        {zone && <h3 className={styles.zone}>Zone</h3>}
        {bonusNotes && <h3 className={styles.bonusNotes}>Receive</h3>}
        <h3>Notes</h3>
      </div>
      {badgeList.map(
        mapBadges(character.toggleBadge.bind(this, badges.active, section))
      )}
    </div>
  );
}

const mapBadges = (complete) => (b, i) => {
  const { hero, villain, praetorian } = b;
  const { name, notes, completed } = b;
  const { bonusNotes, location, zone } = b;
  return (
    <div
      key={i}
      className={styles.row}
      style={{ textDecoration: completed ? 'line-through' : null }}
      onClick={complete.bind(this, i)}
    >
      <p>
        {hero && 'H'}
        {villain && 'V'}
        {praetorian && 'P'}
      </p>
      <div className={styles.namesContainer}>
        {name.split(' / ').map((n) => (
          <p key={n} className={styles.name}>
            {n}
          </p>
        ))}
      </div>
      {location && (
        <p
          className={styles.location}
        >{`(${location.x}, ${location.y}, ${location.z})`}</p>
      )}
      {zone && <p className={styles.zone}>{zone}</p>}
      {bonusNotes && <p className={styles.bonusNotes}>{bonusNotes}</p>}
      <p>{notes}</p>
    </div>
  );
};

const filterSearch = (search) => (b) => {
  if (!search) {
    return true;
  }

  for (let key in b) {
    if (Array.isArray(b[key])) {
      for (let i = 0; i < b[key].length; i++) {
        if (b[key][i].includes(search)) {
          return true;
        }
      }
    } else if (
      typeof b[key] === 'number' &&
      b[key].toString().includes(search)
    ) {
      return true;
    } else if (typeof b[key] === 'string' && b[key].includes(search)) {
      return true;
    }
  }

  return false;
};

export default BadgeList;
