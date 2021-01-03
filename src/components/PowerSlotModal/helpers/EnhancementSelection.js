import React from "react";
import styles from "../styles.module.scss";
import enhancement from "../../../assets/cohImages/enhancements/sApocalypse.png";
import { getEnhancementOverlay } from "js/getImage.js";

import { combineClasses } from "js/utility.js";

export default function EnhancementSelection(props) {
  return (
    <div className={styles.enhancementSelection}>
      <div className={styles.category}>
        <h3>Standard</h3>
        <h3 className={styles.activeCat}>Sets</h3>
      </div>
      <div className={styles.subcategory}>
        <h4 className={styles.activeSub}>Ranged</h4>
        <h4>Blaster</h4>
        <h4>Universal</h4>
      </div>
      <div className={styles.renderEnh}>{renderEnhancements()}</div>

      <div className={styles.setEnhancements}>{renderSet()}</div>
    </div>
  );
}

function renderEnhancements(num = 12, active = 5) {
  const enhList = [];
  for (let i = 0; i < num; i++) {
    const className =
      styles.enhancementWithOverlay +
      (i === active ? " " + styles.activeSet : "");
    enhList.push(
      <div key={i} className={className}>
        <img src={enhancement} alt="enhancement" />
        <img
          src={getEnhancementOverlay("mutant", "IO")}
          alt="enhancement overlay"
        />
      </div>
    );
  }
  return enhList;
}

const defaultSet = [
  "Dmg",
  "Acc/Dmg/Rech/End",
  "Acc/Dmg/Rech",
  "Acc/Rech",
  "Dmg/End",
  "Proc",
];

function renderSet() {
  return defaultSet.map((text, i) => (
    <div key={text} className={styles.setEnhancement}>
      <div className={styles.enhancementWithOverlay}>
        <img src={enhancement} alt="enhancement" />
        <img
          src={getEnhancementOverlay("mutant", "IO")}
          alt="enhancement overlay"
        />
      </div>
      <div className={styles.statPill}>{getPillText(text)}</div>
    </div>
  ));
}

function getPillText(text) {
  return text.split("/").map((stat, j, splitArr) => {
    const isLast = j === splitArr.length - 1;
    return (
      <div>
        <p
          className={combineClasses(
            styles[stat.toLowerCase()],
            j === 0 && styles.left,
            isLast && styles.right
          )}
        >
          {stat}
        </p>
        {!isLast && <div className={styles.pillDivider} />}
      </div>
    );
  });
}
