import React from "react";

import ShadowModal from "../ShadowModal/";
import PowerSlotHeader from "./helpers/PowerSlotHeader.js";
import EnhancementSelection from "./helpers/EnhancementSelection.js";

import styles from "./styles.module.scss";

export default function PowerSlotModal(props) {
  return (
    <ShadowModal>
      <PowerSlotHeader />
      <main>
        <EnhancementSelection />
      </main>
    </ShadowModal>
  );
}
