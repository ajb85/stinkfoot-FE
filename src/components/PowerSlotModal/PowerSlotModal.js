import React, { useCallback } from "react";

import ShadowModal from "../ShadowModal/";
import PowerSlotHeader from "./helpers/PowerSlotHeader.js";
import EnhancementSelection from "./helpers/EnhancementSelection.js";
import SetBonuses from "./helpers/SetBonuses.js";
import PowerStats from "./helpers/PowerStats.js";

import useActiveSets from "providers/builder/useActiveSets.js";
import usePowerSlots from "providers/builder/usePowerSlots.js";
import { useTogglePowerSlot } from "hooks/powersets.js";
import { usePowerFromRef } from "hooks/powersets.js";

import styles from "./styles.module.scss";

export default function PowerSlotModal(props) {
  const {
    tracking: { toggledSlot },
  } = useActiveSets();
  const { powerSlots, updatePowerSlotNav } = usePowerSlots();
  const togglePowerSlot = useTogglePowerSlot(toggledSlot);

  const setTab = useCallback(
    (section) => updatePowerSlotNav(toggledSlot, { section }),
    [toggledSlot]
  );

  const { navigation, powerRef, level } = powerSlots[toggledSlot] || {};
  const power = usePowerFromRef(powerRef);

  if (!powerSlots[toggledSlot]) {
    return null;
  }

  return (
    <ShadowModal>
      <PowerSlotHeader power={power} level={level} />
      <section className={styles.main}>
        <EnhancementSelection tab={navigation.section} setTab={setTab} />
        <SetBonuses disabled={navigation.section !== "sets"} />
        <PowerStats />
      </section>
    </ShadowModal>
  );
}
