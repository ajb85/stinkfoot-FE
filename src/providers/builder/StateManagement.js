import { useEffect } from "react";
import useEnhancementNavigation from "./useEnhancementNavigation";
import usePowerSlots from "./usePowerSlots.js";
import useActiveSets from "./useActiveSets.js";

export default function StateManager(props) {
  const { enhNavigation, setEnhNavigation } = useEnhancementNavigation();
  const { powerSlots } = usePowerSlots();
  const { tracking } = useActiveSets();

  useEffect(() => {
    if (tracking.toggledSlot !== null) {
      const { setTypes } = powerSlots[tracking.toggledSlot].power;
      const isBrowsingIOSets = !isNaN(Number(enhNavigation.tier));
      setEnhNavigation({
        ...enhNavigation,
        tier: isBrowsingIOSets ? setTypes[0] : "IO",
      });
    }

    // eslint-disable-next-line
  }, [tracking.toggledSlot]);

  return props.children;
}
