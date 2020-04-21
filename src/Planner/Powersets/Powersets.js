import React from 'react';

import powersets from 'data/powersets.js';

import styles from './styles.module.scss';

function Powersets({ build, updateBuild, togglePower }) {
  const { primary, secondary, archetype } = build;
  const { primaries, secondaries } = powersets[archetype];

  const renderPowerset = (set, isPrimary) => {
    return (
      <div className={styles.powersList}>
        {set.powers
          .filter(({ isEpic }) => !isEpic)
          .map((p) => {
            const isUsedPower = build.powerLookup.hasOwnProperty(p.displayName);
            return (
              <p
                key={p.displayName}
                style={{
                  color: isUsedPower
                    ? 'lightgreen'
                    : build.activeLevel >= p.level
                    ? 'yellow'
                    : 'grey',
                }}
                onClick={togglePower.bind(this, p, isPrimary)}
              >
                {p.displayName}
              </p>
            );
          })}
      </div>
    );
  };
  return (
    <section className={styles.Powersets}>
      <div>
        {/* <h2>Powersets</h2> */}
        <div className={styles.powersetContainer}>
          <div className={styles.powerset}>
            <h3>Primary</h3>
            <select
              value={primary.displayName}
              name="primary"
              onChange={(e) => updateBuild(e)}
            >
              {primaries.map((p) => (
                <option key={p.displayName} value={p.displayName}>
                  {p.displayName}
                </option>
              ))}
            </select>
            {renderPowerset(
              primaries.find(
                ({ displayName }) => displayName === primary.displayName
              ),
              true
            )}
          </div>
          <div className={styles.powerset}>
            <h3>Secondary</h3>
            <select
              value={secondary.displayName}
              name="secondary"
              onChange={(e) => updateBuild(e)}
            >
              {secondaries.map((p) => (
                <option key={p.displayName} value={p.displayName}>
                  {p.displayName}
                </option>
              ))}
            </select>
            {renderPowerset(
              secondaries.find(
                ({ displayName }) => displayName === secondary.displayName
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Powersets;
