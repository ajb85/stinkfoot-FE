import React, { useState, useEffect, useCallback } from "react";

import Selection from "./Selection/";
import BadgeList from "./BadgeList/";

import { badgeTypes } from "./data/";

import styles from "./styles.module.scss";

function Badger(props) {
  document.title = "Badge Tracker";
  const lastSection = localStorage.getItem("activeBadgeSection");
  const [section, setSection] = useState(
    lastSection ? JSON.parse(lastSection) : badgeTypes[0].code
  );

  const saveActiveSection = useCallback(
    (e) => {
      setSection(e.target.value);
    },
    [setSection]
  );

  const filterState = useState({ search: "", showCompleted: false });

  return (
    <div className={styles.Badger}>
      <Selection
        section={section}
        updateSection={saveActiveSection}
        filterState={filterState}
      />

      <BadgeList section={section} filters={filterState[0]} />
    </div>
  );
}

export default Badger;
