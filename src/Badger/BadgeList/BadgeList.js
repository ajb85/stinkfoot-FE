import React from "react";

import useBadges from "providers/useBadges.js";
import badgeData from "../data/";

import styles from "./styles.module.scss";

function BadgeList({ section, filters }) {
  const { badges, toggleComplete } = useBadges();

  const badgeList = badgeData[section].filter(
    filterSearch(filters, badges[section])
  );
  const { bonusNotes, location, zone } = badgeList[0] || {};

  return (
    <div className={styles.BadgeList}>
      <div className={styles.table}>
        <div className={styles.row}>
          <div className={joinClass("cell", "avail")}>
            <h3>Availability</h3>
          </div>
          <div className={joinClass("cell", "names")}>
            <h3 className={styles.name}>Name</h3>
          </div>
          {zone && (
            <div className={joinClass("cell", "zone")}>
              <h3 className={styles.zone}>Zone</h3>
            </div>
          )}
          {location && (
            <div className={joinClass("cell", "location")}>
              <h3 className={styles.location}>Location</h3>
            </div>
          )}
          {bonusNotes && (
            <div className={joinClass("cell", "bonusNotes")}>
              <h3 className={styles.bonusNotes}>Receive</h3>
            </div>
          )}
          <div className={joinClass("cell", "notes")}>
            <h3>Notes</h3>
          </div>
        </div>
        {!badgeList.length && (
          <p style={{ textAlign: "center", padding: 18 }}>
            {filters.search
              ? "Oops! No badges match that criteria!"
              : "Oh dang, you completed this section.  May I suggest conquering going outside next?"}
          </p>
        )}
        {badgeList.map((b, i) => {
          const {
            hero,
            villain,
            praetorian,
            name,
            notes,
            bonusNotes,
            location,
            zone,
          } = b;
          const isComplete = badges[section][name];

          return (
            <div
              key={b.badgeIndex}
              className={styles.row}
              style={{
                textDecoration: isComplete ? "line-through" : null,
                opacity: isComplete ? 0.5 : null,
              }}
              onClick={toggleComplete.bind(this, b)}
            >
              <div className={joinClass("cell", "avail")}>
                <p>
                  {hero && "H"}
                  {villain && "V"}
                  {praetorian && "P"}
                </p>
              </div>
              <div className={joinClass("cell", "names")}>
                {name.split(" / ").map((n, i) => (
                  <p
                    key={n}
                    style={{ color: getNameColor(b, i) }}
                    className={styles.name}
                  >
                    {n}
                  </p>
                ))}
              </div>
              {zone && (
                <div className={joinClass("cell", "zone")}>
                  <p>{zone}</p>
                </div>
              )}
              {location && (
                <div className={joinClass("cell", "location")}>
                  <p>{`(${location.x}, ${location.y}, ${location.z})`}</p>
                </div>
              )}
              {bonusNotes && (
                <div className={joinClass("cell", "bonusNotes")}>
                  <p>{bonusNotes}</p>
                </div>
              )}
              <div className={joinClass("cell", "notes")}>
                <p>{notes}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const filterSearch = (filters, completedList) => (b) => {
  const { showCompleted } = filters;
  const search = filters.search.toLowerCase();
  const isComplete = completedList[b.name];
  if (!showCompleted && isComplete) {
    return false;
  }

  for (let key in b) {
    if (Array.isArray(b[key])) {
      // !!! CURRENTLY UNUSED AND THUS OUTDATED !!!
      for (let i = 0; i < b[key].length; i++) {
        if (b[key][i].toLowerCase().includes(search)) {
          return true;
        }
      }
    } else if (
      typeof b[key] === "number" &&
      b[key].toString().toLowerCase().includes(search)
    ) {
      // !!! CURRENTLY UNUSED AND THUS OUTDATED !!!
      return true;
    } else if (
      typeof b[key] === "string" &&
      b[key].toLowerCase().includes(search)
    ) {
      return true;
    }
  }

  return false;
};

const joinClass = (c1, c2) => styles[c1] + " " + styles[c2];

const getNameColor = (badge, i) => {
  const { hero, villain, name } = badge;

  const split = name.split(" / ");

  const colors = ["lightBlue", "#9a3d3f", "gold"];

  if (split.length > 1) {
    return colors[i];
  } else if (hero) {
    return colors[0];
  } else if (villain) {
    return colors[1];
  } else {
    return colors[2];
  }
};

export default BadgeList;
