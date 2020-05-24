import React from 'react';

import { usePlannerState } from 'Providers/PlannerStateManagement.js';

import styles from '../styles.module.scss';

export default function SetPreviewMenu(props) {
  const stateManager = usePlannerState();
  const { display, powerSlotIndex, enhNavigation } = props;
  const { displayName, enhancements, setTypeName, levels } = props.set;
  const setBonuses = stateManager.getDisplayBonuses(displayName, enhNavigation);

  const bonusTier =
    stateManager.getBonusTiersForPowerSlot(powerSlotIndex)[
      enhancements[0].setIndex
    ] || 0;

  return (
    <div className={styles.EnhHoverMenu} style={{ display }}>
      <div
        className={styles.menu}
        style={{
          border: display && display !== 'null' ? '1px solid red' : null,
        }}
      >
        <div className={styles.titles}>
          <h2>
            {displayName}, {setTypeName}
          </h2>
          {/* <h3>Set Type: {setTypeName}</h3> */}
          <h3>{parseLevels(levels)}</h3>
        </div>
        <div className={styles.hoverContainer}>
          <h3
            className={styles.addFullSet}
            onClick={stateManager.addFullEnhancementSet.bind(
              this,
              powerSlotIndex,
              enhNavigation,
              enhancements[0].setIndex,
              50
            )}
          >
            Add Full Set
          </h3>
          {/* <h3>Enhancements</h3> */}
          <div className={styles.enhancementContainer}>
            {enhancements.map((enh) => {
              const enhancementIndex = stateManager.findEnhancementIndex(
                enh,
                powerSlotIndex
              );

              const isAdded = enhancementIndex > -1;

              const canBeAdded = !isAdded
                ? stateManager.canEnhancementGoInPowerSlot(enh, powerSlotIndex)
                : null;

              const c = styles.enhancementPill;
              const className = isAdded
                ? c + ' ' + styles.activePill
                : !canBeAdded
                ? c + ' ' + styles.inactivePill
                : c;

              return (
                <p
                  key={enh.displayName}
                  onClick={
                    !isAdded && canBeAdded
                      ? stateManager.addEnhancement.bind(
                          this,
                          powerSlotIndex,
                          enh,
                          enhNavigation,
                          50
                        )
                      : stateManager.removeSlots.bind(
                          this,
                          powerSlotIndex,
                          enhancementIndex
                        )
                  }
                  className={className}
                >
                  {stateManager.shortenEnhName(enh.displayName)}
                </p>
              );
            })}
          </div>
        </div>
        <div className={styles.hoverContainer}>
          <h3>Set Bonuses</h3>
          {setBonuses.reduce((acc, b, bonusIndex) => {
            const { unlocked, bonusName, displays } = b;
            const bonusCount = stateManager.getBonusCount(bonusName);
            const willGetBonus = bonusCount < 5;
            const isBonusUnlocked = unlocked <= bonusTier;
            const bonusColor = {
              color: isBonusUnlocked
                ? bonusCount === 5
                  ? 'chartreuse'
                  : bonusCount > 5
                  ? 'red'
                  : 'gold'
                : willGetBonus
                ? null
                : 'grey',
              textDecoration:
                !isBonusUnlocked && !willGetBonus ? 'line-through' : null,
            };

            acc.push(
              <div key={bonusIndex} className={styles.bonusContainer}>
                <p style={bonusColor}>
                  ({unlocked}) {`${bonusCount > 0 ? `(x${bonusCount})` : ''}`}
                </p>
                <div className={styles.bonusText}>
                  {displays.map((display) => (
                    <p style={bonusColor} key={display}>
                      {display}
                    </p>
                  ))}
                </div>
              </div>
            );
            return acc;
          }, [])}
        </div>
      </div>
    </div>
  );
}

const parseLevels = ({ min, max }) => {
  return min === max ? `Level ${min}` : `Levels: ${min} - ${max}`;
};
