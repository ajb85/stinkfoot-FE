import React from "react";

import { CharacterDetailsProvider } from "./useCharacterDetails.js";
import { IndexTrackingProvider } from "./useActiveSets.js";
import { PowerSlotsProvider } from "./usePowerSlots.js";
import { PoolPowersProvider } from "./usePoolPowers.js";
import { EnhNavProvider } from "./useEnhancementNavigation.js";
import StateManagement from "./StateManagement.js";

export default (props) => (
  <EnhNavProvider>
    <CharacterDetailsProvider>
      <PowerSlotsProvider>
        <PoolPowersProvider>
          <IndexTrackingProvider>
            <StateManagement>{props.children}</StateManagement>
          </IndexTrackingProvider>
        </PoolPowersProvider>
      </PowerSlotsProvider>
    </CharacterDetailsProvider>
  </EnhNavProvider>
);
