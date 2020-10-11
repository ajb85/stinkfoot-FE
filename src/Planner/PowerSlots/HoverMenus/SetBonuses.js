import React from "react";

import { usePlannerState } from "Providers/PlannerStateManagement.js";
import useEnhNavigation from "Providers/EnhancementNavigation.js";

import styles from "../styles.module.scss";

function SetBonuses({ set, powerSlotIndex }) {
  const stateManager = usePlannerState();
  const { enhancements, displayName } = set;
  const { enhNavigation } = useEnhNavigation();
  const setBonuses = stateManager.getDisplayBonuses(displayName, enhNavigation);

  const bonusTier =
    stateManager.getBonusTiersForPowerSlot(powerSlotIndex)[
      enhancements[0].setIndex
    ] || 0;
  return (
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
              ? "chartreuse"
              : bonusCount > 5
              ? "red"
              : "gold"
            : willGetBonus
            ? null
            : "grey",
          textDecoration:
            !isBonusUnlocked && !willGetBonus ? "line-through" : null,
        };

        acc.push(
          <div key={bonusIndex} className={styles.bonusContainer}>
            <p style={bonusColor}>{`${
              bonusCount > 0 ? `x${bonusCount}` : ""
            }`}</p>
            <p style={bonusColor}>({unlocked})</p>
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
  );
}

export default SetBonuses;
