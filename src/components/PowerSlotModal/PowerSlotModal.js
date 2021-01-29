import React from "react";

import ShadowModal from "../ShadowModal/";
import PowerSlotHeader from "./helpers/PowerSlotHeader.js";
import EnhancementSelection from "./helpers/EnhancementSelection.js";
import SetBonuses from "./helpers/SetBonuses.js";
import PowerStats from "./helpers/PowerStats.js";

import styles from "./styles.module.scss";

export default function PowerSlotModal(props) {
  return (
    <ShadowModal>
      <PowerSlotHeader />
      <main className={styles.main}>
        <EnhancementSelection />
        <SetBonuses disabled={false} />
        <PowerStats />
      </main>
    </ShadowModal>
  );
}
