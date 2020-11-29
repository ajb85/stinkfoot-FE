import React from "react";

import { CharacterDetailsProvider } from "./useCharacterDetails.js";
import { IndexTrackingProvider } from "./useActiveSets.js";
import { PowerSlotsProvider } from "./usePowerSlots.js";
import { PoolPowersProvider } from "./usePoolPowers.js";
import StateManagement from "./StateRelationships.js";

export default (props) => (
  <CharacterDetailsProvider>
    <PowerSlotsProvider>
      <PoolPowersProvider>
        <IndexTrackingProvider>
          <StateManagement>{props.children}</StateManagement>
        </IndexTrackingProvider>
      </PoolPowersProvider>
    </PowerSlotsProvider>
  </CharacterDetailsProvider>
);
