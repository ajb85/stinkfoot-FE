import React from 'react';

import { useBadges } from 'Providers/Badges.js';

import styles from './styles.module.scss';

function BadgeList({ section, search }) {
  const { badges, character } = useBadges();

  if (!Object.keys(badges.characters).length || !badges.active) {
    return <div />;
  }

  const badgeList = badges.characters[badges.active][section].filter(
    filterSearch(search)
  );

  const { bonusNotes, location, zone } = badgeList[0];

  return (
    <div className={styles.BadgeList}>
      <div className={styles.row}>
        <h3>Availability</h3>
        <h3 className={styles.name}>Name</h3>
        {zone && <h3 className={styles.zone}>Zone</h3>}
        {location && <h3 className={styles.location}>Location</h3>}
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
      {zone && (
        <div className={styles.zone}>
          <p>{zone}</p>
        </div>
      )}
      {location && (
        <div className={styles.location}>
          <p>{`(${location.x}, ${location.y}, ${location.z})`}</p>
        </div>
      )}
      {bonusNotes && (
        <div className={styles.bonusNotes}>
          <p>{bonusNotes}</p>
        </div>
      )}
      <div className={styles.notes}>
        <p>{notes}</p>
      </div>
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
