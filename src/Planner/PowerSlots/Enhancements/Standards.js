import React from 'react';

import { usePlannerState } from 'Providers/PlannerStateManagement.js';
import HoverMenu from '../HoverMenus/Standards.js';

import styles from '../styles.module.scss';

export default function StandardEnhancements(props) {
  const sections = ['IO', 'SO', 'DO', 'TO'];
  const { selectionState, powerSlotIndex, power: p } = props;
  const [enhNavigation, setEnhNavigation] = selectionState;
  const stateManager = usePlannerState();
  const overlayImg = stateManager.getEnhancementOverlay(enhNavigation.tier);

  return (
    <div className={styles.enhPreviewContainer}>
      <div className={styles.enhPreviewList}>
        {stateManager
          .getEnhancementSectionForPower(p, enhNavigation)
          .map((enh, i) => (
            <div className={styles.enhPreview} key={`${enh.fullName} @ ${i}`}>
              <div
                className={styles.enhancementImage}
                onClick={stateManager.addEnhancement.bind(
                  this,
                  powerSlotIndex,
                  enh,
                  enhNavigation,
                  50
                )}
              >
                <img src={overlayImg} alt={enh.fullName} />
                <img src={enh.image} alt={enh.fullName} />

                <HoverMenu enhancement={enh} />
              </div>
            </div>
          ))}
      </div>
      <div className={styles.EnhPreviewSubSectionPreview}>
        {sections.map((tier) => (
          <p
            key={tier}
            onClick={setEnhNavigation.bind(this, {
              ...enhNavigation,
              tier,
              ioSet: null,
            })}
            style={{
              color: enhNavigation.tier === tier ? 'red' : null,
              cursor: 'pointer',
            }}
          >
            {tier}
          </p>
        ))}
      </div>
    </div>
  );
}
