import React from "react";

import { CharacterDetailsProvider } from "./useCharacterDetails.js";
import { IndexTrackingProvider } from "./useActiveSets.js";
import { PowerSlotsProvider } from "./usePowerSlots.js";
import { PoolPowersProvider } from "./usePoolPowers.js";
import { EnhNavProvider } from "./useEnhancementNavigation.js";

export default (props) => (
  <CharacterDetailsProvider>
    <IndexTrackingProvider>
      <PowerSlotsProvider>
        <PoolPowersProvider>
          <EnhNavProvider>{props.children}</EnhNavProvider>
        </PoolPowersProvider>
      </PowerSlotsProvider>
    </IndexTrackingProvider>
  </CharacterDetailsProvider>
);
