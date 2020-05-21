import React from 'react';

import { usePlannerState } from 'Providers/PlannerStateManagement.js';
import HoverMenu from '../HoverMenus/IOSets.js';

import styles from '../styles.module.scss';

export default function IOSets(props) {
  const { selectionState, powerSlotIndex, power: p } = props;
  const [enhNavigation, setEnhNavigation] = selectionState;
  const stateManager = usePlannerState();

  const overlayImg = stateManager.getEnhancementOverlay('IO');

  const updateNavigation = (i) => {
    const ioSetIndex = i === enhNavigation.ioSetIndex ? null : i;
    setEnhNavigation({ ...enhNavigation, ioSetIndex });
  };

  const enhancementsData = stateManager.getEnhancementSectionForPower(
    p,
    enhNavigation
  );

  return (
    <div className={styles.enhPreviewContainer}>
      <div className={styles.enhPreviewList}>
        {enhancementsData.map((enh, i) => (
          <div className={styles.enhPreview} key={`${enh.fullName} @ ${i}`}>
            <div className={styles.enhancementImage}>
              {!enh.isAttuned && <img src={overlayImg} alt={enh.fullName} />}
              <img
                src={enh.image}
                alt={enh.fullName}
                onClick={updateNavigation.bind(this, i)}
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
