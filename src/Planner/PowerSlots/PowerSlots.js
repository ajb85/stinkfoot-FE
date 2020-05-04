import React, { Fragment } from 'react';

import { PlannerContext } from 'Providers/PlannerStateManagement.js';

import styles from './styles.module.scss';

function PowerSlots(props) {
  const enhNavigation = React.useState({
    section: 'standard',
    tier: 'IO',
  });

  const stateManager = React.useContext(PlannerContext);
  let index = 0;

  const { selected /*, defaults*/ } = stateManager
    .getFromState('powerSlots')
    .reduce(
      (acc, cur, originalIndex) => {
        const withIndex = { ...cur, originalIndex };
        if (cur.type === 'default') {
          acc.defaults.push(withIndex);
        } else {
          if (!acc.selected[index]) {
            acc.selected.push([]);
          }

          acc.selected[index].push(withIndex);

          if (acc.selected[index].length >= 8) {
            index++;
          }
        }
        return acc;
      },
      { selected: [], defaults: [] }
    );

  return (
    <div className={styles.Powers}>
      {selected.map((column, columnNumber) => {
        return (
          <div key={`Column ${columnNumber}`} className={styles.column}>
            {column.map((powerSlot) => {
              const { originalIndex } = powerSlot;
              const isEmpty = !powerSlot.power;
              return (
                <Fragment key={`Fragment ${originalIndex}`}>
                  {isEmpty ? (
                    <EmptyPowerSlot render={powerSlot} />
                  ) : (
                    <PowerSlot
                      render={powerSlot}
                      selectionState={enhNavigation}
                    />
                  )}
                </Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function EmptyPowerSlot({ render }) {
  const stateManager = React.useContext(PlannerContext);
  const { level, originalIndex } = render;
  const isActive = stateManager.activeLevel === level;
  const key = `empty ${originalIndex}`;
  return (
    <div key={key} className={styles.powerContainer}>
      <div
        className={styles.power}
        onClick={(e) => {
          e.target.name = 'activeLevelIndex';
          e.target.value = originalIndex;
          stateManager.updateTracking(e);
        }}
        style={{ backgroundColor: isActive ? 'green' : 'grey' }}
      >
        <p>({level})</p>
      </div>
    </div>
  );
}

function PowerSlot({ render, selectionState }) {
  const [enhNavigation, setEnhNavigation] = selectionState;
  const stateManager = React.useContext(PlannerContext);
  const { getPower } = stateManager;
  const { level, power, enhSlots, originalIndex } = render;
  const isToggled = stateManager.toggledPowerSlotIndex === originalIndex;
  const p = power ? getPower(power) : {};
  const zIndex =
    stateManager.getFromState('powerSlots').length * 2 - originalIndex * 2;
  const { togglePowerSlot, removeSlot } = stateManager;

  const overlayImg = stateManager.getEnhancementOverlay(enhNavigation.tier);

  const handlePillClick = (e, psIndex) => {
    const { className } = e.target;
    if (
      className === 'pillText' ||
      stateManager.toggledPowerSlotIndex !== psIndex
    ) {
      togglePowerSlot(psIndex);
    }
  };

  return (
    <div
      className={styles.powerContainer}
      onClick={(e) => handlePillClick(e, originalIndex)}
      key={p.displayName}
    >
      <div
        className={`${styles.power} ${isToggled && styles.toggled}`}
        style={{
          backgroundColor: '#1b4ea8',
          zIndex,
        }}
      >
        <p className="pillText">
          ({level}) {p.displayName}
        </p>

        <div className={styles.selectEnhancements}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 9px',
            }}
          >
            <p
              onClick={() => setEnhNavigation({ ...enhNavigation, tier: 'IO' })}
              style={{
                color: enhNavigation.tier === 'IO' ? 'red' : null,
                cursor: 'pointer',
              }}
            >
              IO
            </p>
            <p
              onClick={() => setEnhNavigation({ ...enhNavigation, tier: 'SO' })}
              style={{
                color: enhNavigation.tier === 'SO' ? 'red' : null,
                cursor: 'pointer',
              }}
            >
              SO
            </p>
            <p
              onClick={() => setEnhNavigation({ ...enhNavigation, tier: 'DO' })}
              style={{
                color: enhNavigation.tier === 'DO' ? 'red' : null,
                cursor: 'pointer',
              }}
            >
              DO
            </p>
            <p
              onClick={() => setEnhNavigation({ ...enhNavigation, tier: 'TO' })}
              style={{
                color: enhNavigation.tier === 'TO' ? 'red' : null,
                cursor: 'pointer',
              }}
            >
              TO
            </p>
          </div>
          <div className={styles.enhPreviewList}>
            {stateManager
              .getEnhancementSectionForPower(p, enhNavigation.section)
              .map((enh, i) => (
                <div
                  className={styles.enhPreview}
                  key={`${enh.fullName} @ ${i}`}
                >
                  <div
                    className={styles.enhancementImage}
                    onClick={stateManager.addEnhancement.bind(
                      this,
                      originalIndex,
                      enh,
                      enhNavigation.tier,
                      50
                    )}
                  >
                    <img src={overlayImg} alt={enh.fullName} />
                    <img src={enh.image} alt={enh.fullName} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div
        style={{ zIndex: zIndex + 1 }}
        className={styles.enhancementsContainer}
      >
        {enhSlots.map(({ slotLevel, enhancement }, j) => {
          const displayLevel = slotLevel === null ? level : slotLevel;

          const images = enhancement
            ? stateManager.getEnhancementAndOverlayImages(enhancement)
            : null;

          return (
            <React.Fragment key={`${slotLevel} @ ${j}`}>
              {images ? (
                <div
                  className={styles.enhancementSlot}
                  onClick={stateManager.removeSlot.bind(this, originalIndex, j)}
                >
                  <div
                    className={styles.enhancementImage}
                    style={{ left: 8, top: 0 }}
                  >
                    <img src={images.overlay} alt={enhancement.displayName} />
                    <img
                      src={images.enhancement}
                      alt={enhancement.displayName}
                    />
                    <p>{displayLevel}</p>
                  </div>
                </div>
              ) : (
                <div className={styles.enhancementSlot}>
                  <div
                    key={`${originalIndex} ${j}`}
                    onClick={removeSlot.bind(this, originalIndex, j)}
                    className={styles.enhancementBubble}
                  >
                    <p>{displayLevel}</p>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default PowerSlots;
