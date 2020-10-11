import React, { useState } from "react";

import ManageCharacter from "./ManageCharacter/";
import Selection from "./Selection/";
import BadgeList from "./BadgeList/";

import useBadges from "hooks/useBadges.js";

import { badgeTypes } from "./data/";

import styles from "./styles.module.scss";

function Badger(props) {
  const lastSection = localStorage.getItem("activeBadgeSection");
  const [section, setSection] = useState(
    lastSection ? JSON.parse(lastSection) : null
  );

  const filterState = useState({ search: "", showCompleted: false });

  const { badges } = useBadges();

  React.useEffect(() => {
    if (!section) {
      setSection(badgeTypes[0].code);
      saveLocal(badgeTypes[0].code);
    }
  }, [section]);

  const charCount = Object.keys(badges.characters).length;
  return (
    <div className={styles.Badger}>
      <ManageCharacter />
      {charCount > 0 && (
        <Selection
          section={section}
          updateSection={saveActiveSection(setSection)}
          filterState={filterState}
        />
      )}
      {charCount > 0 && (
        <BadgeList section={section} filters={filterState[0]} />
      )}
    </div>
  );
}

const saveActiveSection = (setSection) => (e) => {
  saveLocal(e.target.value);
  setSection(e.target.value);
};

const saveLocal = (data) =>
  localStorage.setItem("activeBadgeSection", JSON.stringify(data));

export default Badger;
