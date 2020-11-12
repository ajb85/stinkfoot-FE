import React from "react";

import InPlaceAbsolute from "components/InPlaceAbsolute/";

import usePowerSlots from "providers/builder/usePowerSlots";
import {
  useGetEnhancementsForPower,
  useGetEnhancementOverlay,
  useGetSetBonusDataForPowerSlot,
  useAddEnhancement,
  useRemoveEnhancement,
} from "hooks/enhancements";
import useEnhNavigation from "providers/builder/useEnhancementNavigation.js";

import shortenEnhName from "js/shortenEnhName.js";

import styles from "./styles.module.scss";

function EnhancementSelection(props) {
  const { powerSlots } = usePowerSlots();
  const powerSlot = powerSlots[props.powerSlotIndex];
  const enhCategories = useGetEnhancementsForPower()(powerSlot.power);
  const getOverlay = useGetEnhancementOverlay();
  const getSetBonusesForPowerSlot = useGetSetBonusDataForPowerSlot(powerSlot);
  const addEnhancement = useAddEnhancement(props.powerSlotIndex);
  const removeEnhancement = useRemoveEnhancement(props.powerSlotIndex);
  const { enhNavigation } = useEnhNavigation();
  const { section, tier } = enhNavigation;

  const enhLookup = powerSlot.enhSlots.reduce((acc, { enhancement }, i) => {
    if (enhancement) {
      acc[enhancement.fullName] = i;
    }
    return acc;
  }, {});

  const isSet = section === "sets";
  const toggleEnhancement = (enh) => {
    const shouldRemove = isSet && enhLookup.hasOwnProperty(enh.fullName);
    if (shouldRemove) {
      removeEnhancement(enhLookup[enh.fullName]);
    } else {
      addEnhancement(enh);
    }
  };

  return (
    <div className={styles.enhancementPreview}>
      {enhCategories.map((c) => (
        <div
          key={c.fullName}
          onClick={isSet ? noFunc : toggleEnhancement.bind(this, c)}
        >
          <img src={getOverlay(tier)} alt="enhancement overlay" />
          <img src={c.image} alt="enhancement" />
          <EnhancementSelectionHoverMenu
            category={c}
            toggleEnhancement={toggleEnhancement}
            enhLookup={enhLookup}
          />
          {section === "sets" && (
            <ShowBonusesHoverMenu
              set={c}
              bonusData={getSetBonusesForPowerSlot(c)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default EnhancementSelection;

function EnhancementSelectionHoverMenu({
  category,
  toggleEnhancement,
  enhLookup,
}) {
  const isSet = category.enhancements;
  const levelText = category.levels
    ? `, Level ${category.levels.min} - ${category.levels.max}`
    : "";

  return (
    <InPlaceAbsolute zIndex={200}>
      <div className={styles.enhancementHoverMenu}>
        <h3>
          {category.displayName}
          {levelText}
        </h3>
        <div className={styles.enhancementSelection}>
          {isSet &&
            category.enhancements.map((e) => {
              const isActive = enhLookup.hasOwnProperty(e.fullName);

              return (
                <p
                  className={isActive ? styles.active : ""}
                  key={e.fullName}
                  onClick={toggleEnhancement.bind(this, e)}
                >
                  {shortenEnhName(e.displayName)}
                </p>
              );
            })}
        </div>
      </div>
    </InPlaceAbsolute>
  );
}

function ShowBonusesHoverMenu({ set, bonusData }) {
  // console.log("BONUS DATA: ", bonusData);
  return null;
}

function noFunc() {}

// function FloatingEnhancementSelection({ category }) {
//   const isSet = category.enhancements;

//   return (
//     <div className={styles.enhancementCategory}>
//       <h3>{category.displayName}</h3>
//       {isSet &&
//         category.enhancements.map((e) => {
//           return <p>{shortenEnhName(e.displayName)}</p>;
//         })}
//     </div>
//   );
// }
