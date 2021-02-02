import React from "react";
import styled from "styled-components";

import MaskOverEnhancement from "components/MaskOverEnhancement/";
import OnScreenHover from "components/OnScreenHover/";

import usePowerSlots from "providers/builder/usePowerSlots";
import {
  useEnhancementsForPowerSlot,
  useGetEnhancementOverlay,
  useGetSetBonusDataForPowerSlot,
  useAddEnhancement,
  useRemoveEnhancement,
  useAddFullSet,
} from "hooks/enhancements";

import { useActiveEnhancementSet } from "hooks/powersets.js";
import shortenEnhName from "js/shortenEnhName.js";
import styles from "./styles.module.scss";

function EnhancementSelection(props) {
  const { powerSlots } = usePowerSlots();
  const {
    toggledEnhancementSet,
    toggleActiveEnhancementSet,
  } = useActiveEnhancementSet();
  const powerSlot = powerSlots[props.powerSlotIndex];
  const enhCategories = useEnhancementsForPowerSlot(props.powerSlotIndex)();
  const getOverlay = useGetEnhancementOverlay();
  const getSetBonusesForPowerSlot = useGetSetBonusDataForPowerSlot(powerSlot);
  const addEnhancement = useAddEnhancement(props.powerSlotIndex);
  const removeEnhancement = useRemoveEnhancement(props.powerSlotIndex);
  const addFullSet = useAddFullSet(props.powerSlotIndex);
  const { section, tier, setType } = powerSlot.navigation;
  const enhLookup = powerSlot.enhSlots.reduce((acc, { enhancement }, i) => {
    if (enhancement) {
      acc[enhancement.fullName] = i;
    }
    return acc;
  }, {});

  const isSet = section === "sets";
  const toggleEnhancement = (enh, i) => {
    const shouldRemove = isSet && enhLookup.hasOwnProperty(enh.fullName);
    if (shouldRemove) {
      removeEnhancement(enhLookup[enh.fullName]);
    } else {
      addEnhancement(enh, i);
    }
  };

  const currentCategory = isSet ? enhCategories[setType] || [] : enhCategories;

  return (
    <div className={styles.enhancementPreview}>
      {currentCategory.map((c, i) => {
        const isLocked = isSet && toggledEnhancementSet === i;
        const noActive = !isSet || toggledEnhancementSet === null;
        const className = noActive
          ? styles.isHoverable
          : isLocked
          ? styles.active
          : null;
        const clickFunc = isSet
          ? toggleActiveEnhancementSet.bind(this, i)
          : toggleEnhancement.bind(this, c, i);
        const handleClick = (e) => {
          e.stopPropagation();
          clickFunc();
        };

        const handleMaskClick = addFullSet.bind(this, c.enhancements);
        return (
          <div key={c.fullName} className={className} onClick={handleClick}>
            {isLocked && (
              <MaskOverEnhancement onClick={handleMaskClick} stopProp>
                +
              </MaskOverEnhancement>
            )}
            <img src={getOverlay(tier)} alt="enhancement overlay" />
            <img src={c.image} alt="enhancement" />
            <EnhancementSelectionHoverMenu
              category={c}
              toggleEnhancement={toggleEnhancement}
              enhLookup={enhLookup}
            />
            {isSet && (
              <ShowBonusesHoverMenu bonusData={getSetBonusesForPowerSlot(c)} />
            )}
          </div>
        );
      })}
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
    <OnScreenHover className={styles.floatingMenu}>
      <div className={styles.enhancementHoverMenu}>
        <h3>
          {category.displayName}
          {levelText}
        </h3>
        <div className={styles.enhancementSelection}>
          {isSet &&
            category.enhancements.map((e) => {
              const isAdded = enhLookup.hasOwnProperty(e.fullName);
              const handleClick = (event) => {
                event.stopPropagation();
                toggleEnhancement(e);
              };
              return (
                <p
                  className={isAdded ? styles.active : ""}
                  key={e.fullName}
                  onClick={handleClick}
                >
                  {shortenEnhName(e.displayName)}
                </p>
              );
            })}
        </div>
      </div>
    </OnScreenHover>
  );
}

function ShowBonusesHoverMenu({ bonusData }) {
  return (
    <OnScreenHover className={styles.bonusMenu} zIndex={200}>
      <div className={styles.setBonuses}>
        {bonusData.map(({ displays, isActive, bonusCount }, i) => {
          // const atMax = bonusCount >= 5;
          return (
            <BonusStyle
              key={displays[0]}
              isActive={isActive}
              bonusCount={bonusCount}
            >
              <p>{bonusCount ? "x" + bonusCount : ""}</p>
              <p>({i + 1})</p>
              <div>
                {displays.map((bonus) => (
                  <p key={bonus}>{bonus}</p>
                ))}
              </div>
            </BonusStyle>
          );
        })}
      </div>
    </OnScreenHover>
  );
}

const BonusStyle = styled.div`
  display: flex;

  p {
    color: ${({ isActive, bonusCount }) =>
      isActive
        ? bonusCount <= 5
          ? "green"
          : "red"
        : bonusCount < 5
        ? "yellow"
        : "red"};

    text-decoration: ${({ bonusCount }) =>
      bonusCount >= 5 ? "line-through" : "none"};

    overflow: hidden;
    white-space: nowrap;
  }

  & > p {
    font-size: 10px;

    &:nth-child(1) {
      min-width: 12px;
    }

    &:nth-child(2) {
      margin: 0 5px;
    }
  }

  & > div {
    p {
      font-size: 12px;
    }
  }
`;
