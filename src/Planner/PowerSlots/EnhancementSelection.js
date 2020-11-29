import React, { useRef } from "react";
import styled from "styled-components";

import InPlaceAbsolute from "components/InPlaceAbsolute/";

import usePowerSlots from "providers/builder/usePowerSlots";
import {
  useGetEnhancementsForPower,
  useGetEnhancementOverlay,
  useGetSetBonusDataForPowerSlot,
  useAddEnhancement,
  useRemoveEnhancement,
  useAddFullSet,
} from "hooks/enhancements";
import useEnhNavigation from "providers/builder/useEnhancementNavigation.js";

import { useActiveEnhancementSet } from "hooks/powersets.js";

import shortenEnhName from "js/shortenEnhName.js";
import getScrollbarWidth from "js/getScrollbarWidth.js";

import styles from "./styles.module.scss";

function EnhancementSelection(props) {
  const { powerSlots } = usePowerSlots();
  const {
    toggledEnhancementSet,
    toggleActiveEnhancementSet,
  } = useActiveEnhancementSet();
  const powerSlot = powerSlots[props.powerSlotIndex];
  const enhCategories = useGetEnhancementsForPower()(powerSlot.power);
  const getOverlay = useGetEnhancementOverlay();
  const getSetBonusesForPowerSlot = useGetSetBonusDataForPowerSlot(powerSlot);
  const addEnhancement = useAddEnhancement(props.powerSlotIndex);
  const removeEnhancement = useRemoveEnhancement(props.powerSlotIndex);
  const { enhNavigation } = useEnhNavigation();
  const { section, tier, setType } = enhNavigation;
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
          : toggleEnhancement.bind(this, c);
        const handleClick = (e) => {
          e.stopPropagation();
          clickFunc();
        };
        return (
          <div key={c.fullName} className={className} onClick={handleClick}>
            {isLocked && (
              <AddFullSet
                powerSlotIndex={props.powerSlotIndex}
                enhancements={c.enhancements}
              />
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
  const [hoverPosition, setHoverPosition] = React.useState({});
  const hoverMenu = useRef();
  const isSet = category.enhancements;
  const levelText = category.levels
    ? `, Level ${category.levels.min} - ${category.levels.max}`
    : "";

  React.useEffect(() => {
    // Should eventually update on window changing size
    if (hoverMenu.current) {
      setHoverPosition(getHoverMenuPosition(hoverMenu.current));
    } else {
      setHoverPosition({});
    }
  }, []);

  return (
    <InPlaceAbsolute zIndex={200} parentClassName={styles.floatingMenu}>
      <div
        className={styles.enhancementHoverMenu}
        ref={hoverMenu}
        style={hoverPosition}
      >
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
    </InPlaceAbsolute>
  );
}

function ShowBonusesHoverMenu({ bonusData }) {
  const [hoverPosition, setHoverPosition] = React.useState({});
  const hoverMenu = useRef();

  React.useEffect(() => {
    // Should eventually update on window changing size
    if (hoverMenu.current) {
      setHoverPosition(getHoverMenuPosition(hoverMenu.current));
    } else {
      setHoverPosition({});
    }
  }, []);

  return (
    <InPlaceAbsolute parentClassName={styles.bonusMenu} zIndex={200}>
      <div className={styles.setBonuses} style={hoverPosition} ref={hoverMenu}>
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
    </InPlaceAbsolute>
  );
}

function AddFullSet({ powerSlotIndex, enhancements }) {
  const addFullSet = useAddFullSet(powerSlotIndex);

  const handleClick = React.useCallback(
    (e) => {
      e.stopPropagation();
      addFullSet(enhancements);
    },
    [addFullSet, enhancements]
  );
  return (
    <InPlaceAbsolute zIndex={200} onClick={handleClick}>
      <div className={styles.AddFullSet}>+</div>
    </InPlaceAbsolute>
  );
}

function getHoverMenuPosition(element) {
  if (element) {
    const { x, width } = element.getBoundingClientRect();
    const windowSize = getWindowSize();
    const padding = 5;

    if (width < windowSize.width) {
      if (x < padding || element.style.left) {
        const left = element.style.left || Math.abs(x) + padding;
        return { left };
      } else if (
        x + width + padding > windowSize.width ||
        element.style.right
      ) {
        const right =
          element.style.right || x + width + padding - windowSize.width;
        return { right };
      }
    }
  }
  return {};
}

function getWindowSize() {
  const scrollBarWidth = getScrollbarWidth();
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  const height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  return { width: width - scrollBarWidth, height };
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
