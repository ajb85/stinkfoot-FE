import React from "react";
import styles from "../styles.module.scss";

import NavSlider from "components/NavSlider/";

import { getEnhancementOverlay } from "js/getImage.js";
import { combineClasses } from "js/utility.js";

import enhancement from "../../../assets/cohImages/enhancements/sApocalypse.png";

export default function EnhancementSelection(props) {
  const [tab, setTab] = React.useState("sets");
  return (
    <div className={styles.enhancementSelection}>
      <div className={styles.tabs}>
        <h3
          className={combineClasses(tab === "standard" && styles.activeTab)}
          onClick={setTab.bind(null, "standard")}
        >
          Standard
        </h3>
        <h3
          className={combineClasses(tab === "sets" && styles.activeTab)}
          onClick={setTab.bind(null, "sets")}
        >
          Sets
        </h3>
      </div>
      <div className={styles.tabContent}>
        {tab === "sets" && (
          <NavSlider categories={["Ranged", "Blaster", "Universal"]} />
        )}
        {tab === "standard" && (
          <NavSlider categories={["IO", "SO", "DO", "TO"]} />
        )}
        <div className={styles.renderEnh}>{renderEnhancements()}</div>
      </div>
      <div className={styles.setEnhancementsContainer}>
        <h3>Set Enhancements</h3>
        <div className={styles.setEnhancements}>{renderSet()}</div>
      </div>
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
  "Acc/Rech",
  "Acc/Dmg/Rech",
  "Dmg/End",
  "Acc/Dmg/Rech/End",
  "Dmg",
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
