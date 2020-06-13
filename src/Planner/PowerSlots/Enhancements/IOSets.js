import React, { useEffect, useRef } from 'react';

import { usePlannerState } from 'Providers/PlannerStateManagement.js';
import HoverMenu from '../HoverMenus/IOSets.js';

import styles from '../styles.module.scss';

export default function IOSets(props) {
  const enhRefs = useRef([]);
  const { selectionState, powerSlotIndex, power: p } = props;
  const [enhNavigation, setEnhNavigation] = selectionState;
  const stateManager = usePlannerState();

  const enhancementsData = stateManager.getEnhancementSectionForPower(
    p,
    enhNavigation
  );

  const overlayImg = stateManager.getEnhancementOverlay('IO');

  useEffect(() => {
    if (enhancementsData.length !== enhRefs.current.length) {
      enhRefs.current = enhRefs.current.slice(0, enhancementsData.length);
    }
  }, [enhancementsData.length, enhRefs]);

  return (
    <div className={styles.enhPreviewContainer}>
      <div className={styles.enhPreviewList}>
        {enhancementsData.map((enh, i) => (
          <div className={styles.enhPreview} key={`${enh.fullName} @ ${i}`}>
            <div className={styles.enhancementImage}>
              {!enh.isAttuned && <img src={overlayImg} alt={enh.fullName} />}
              <img
                ref={(ele) => (enhRefs.current[i] = ele)}
                src={enh.image}
                alt={enh.fullName}
                onClick={updateNavigation(selectionState, enhRefs).bind(
                  this,
                  i
                )}
              />
              <HoverMenu
                powerSlotIndex={powerSlotIndex}
                enhNavigation={enhNavigation}
                set={enh}
                display={
                  enhNavigation.ioSetIndex !== null
                    ? i === enhNavigation.ioSetIndex
                      ? 'initial'
                      : 'none'
                    : null
                }
              />
            </div>
          </div>
        ))}
      </div>
      <div className={styles.EnhPreviewSubSectionPreview}>
        {stateManager
          .getSubSectionsForIOSets(p.setTypes)
          .map(({ tier, name }) => (
            <p
              key={tier}
              onClick={setEnhNavigation.bind(this, {
                ...enhNavigation,
                tier,
                ioSetIndex: null,
              })}
              style={{
                color: enhNavigation.tier === tier ? 'red' : null,
                cursor: 'pointer',
              }}
            >
              {name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </p>
          ))}
      </div>
    </div>
  );
}

const updateNavigation = ([enhNavigation, setEnhNavigation], enhRefs) => (
  i
) => {
  console.log('REF: ', enhRefs.current[i].getBoundingClientRect());
  const ioSetIndex = i === enhNavigation.ioSetIndex ? null : i;
  setEnhNavigation({ ...enhNavigation, ioSetIndex });
};
