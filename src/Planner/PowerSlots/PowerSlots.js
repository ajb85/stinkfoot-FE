import React, { Fragment } from 'react';

import { PlannerContext } from 'Providers/PlannerStateManagement.js';

import styles from './styles.module.scss';

function PowerSlots(props) {
  const enhNavigation = React.useState({
    section: 'standard',
    tier: 'IO',
    ioSetIndex: null,
    showSuperior: true,
  });

  const stateManager = React.useContext(PlannerContext);
  let index = 0;

  React.useEffect(() => {
    // Resets navigation whenever a power is opened or closed.  A more long term solution
    // would probably be to store the state for every power slot so there can be a memory of where
    // the user was last time they selected a slot
    enhNavigation[1]({
      ...enhNavigation[0],
      section: 'standard',
      tier: 'IO',
      ioSetIndex: null,
    });
    // eslint-disable-next-line
  }, [stateManager.tracking.powerSlotIndex]);

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
    <section className={styles.PowerSlots}>
      <h2>Power Slots</h2>
      <div className={styles.slotsContainer}>
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
    </section>
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
  const { togglePowerSlot, removeSlots } = stateManager;

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
        {/* Pill Title */}
        <p className="pillText">
          ({level}) {p.displayName}
        </p>

        {/* Select Enhancement Menu */}
        <div className={styles.selectEnhancements}>
          <div className={styles.EnhSectionSelect}>
            <p
              onClick={setEnhNavigation.bind(this, {
                ...enhNavigation,
                section: 'standard',
                tier: 'IO',
                ioSetIndex: null,
              })}
              style={{
                color: enhNavigation.section === 'standard' ? 'red' : null,
              }}
            >
              Standard
            </p>
            <p
              onClick={setEnhNavigation.bind(this, {
                ...enhNavigation,
                section: 'sets',
                tier: p.setTypes[0],
                ioSetIndex: null,
              })}
              style={{ color: enhNavigation.section === 'sets' ? 'red' : null }}
            >
              Sets
            </p>
          </div>
          {/* {enhNavigation.ioSetIndex !== null && (
            <p
              style={{
                cursor: 'pointer',
                textAlign: 'center',
                marginTop: '9px',
              }}
              onClick={stateManager.addFullEnhancementSet.bind(
                this,
                originalIndex,
                enhNavigation
              )}
            >
              Add Full Set
            </p>
          )} */}
          {enhNavigation.section === 'standard' ? (
            <StandardEnhancements
              selectionState={selectionState}
              originalIndex={originalIndex}
              power={p}
            />
          ) : enhNavigation.section === 'sets' ? (
            <IOSetEnhancements
              selectionState={selectionState}
              originalIndex={originalIndex}
              power={p}
            />
          ) : null}
        </div>
      </div>

      {/* Selected Enhancements Render */}
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
                  onClick={removeSlots.bind(this, originalIndex, j)}
                >
                  <div
                    className={styles.enhancementImage}
                    style={{ left: 8, top: 0 }}
                  >
                    {!!images.overlay && (
                      <img src={images.overlay} alt={enhancement.displayName} />
                    )}
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
                    onClick={removeSlots.bind(this, originalIndex, j)}
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

function StandardEnhancements(props) {
  const sections = ['IO', 'SO', 'DO', 'TO'];
  const { selectionState, originalIndex, power: p } = props;
  const [enhNavigation, setEnhNavigation] = selectionState;
  const stateManager = React.useContext(PlannerContext);

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
                  originalIndex,
                  enh,
                  enhNavigation,
                  50
                )}
              >
                <img src={overlayImg} alt={enh.fullName} />
                <img src={enh.image} alt={enh.fullName} />

                <EnhancementPreviewMenu enhancement={enh} />
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

function IOSetEnhancements(props) {
  const { selectionState, originalIndex, power: p } = props;
  const [enhNavigation, setEnhNavigation] = selectionState;
  const stateManager = React.useContext(PlannerContext);

  const overlayImg = stateManager.getEnhancementOverlay('IO');

  const updateNavigation = (i) => {
    const ioSetIndex = i === enhNavigation.ioSetIndex ? null : i;
    setEnhNavigation({ ...enhNavigation, ioSetIndex });
  };

  // const addEnhancement = (enh) => {
  //   stateManager.addEnhancement(originalIndex, enh, enhNavigation, 50);
  // };

  const enhancementsData = stateManager.getEnhancementSectionForPower(
    p,
    enhNavigation
  );

  return (
    <div className={styles.enhPreviewContainer}>
      <div className={styles.enhPreviewList}>
        {enhancementsData.map((enh, i) => (
          <div className={styles.enhPreview} key={`${enh.fullName} @ ${i}`}>
            <div
              className={styles.enhancementImage}
              onClick={updateNavigation.bind(this, i)}
            >
              {!enh.isAttuned && <img src={overlayImg} alt={enh.fullName} />}
              <img src={enh.image} alt={enh.fullName} />
              <SetPreviewMenu
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

function EnhancementPreviewMenu(props) {
  // const stateManager = React.useContext(PlannerContext);
  // console.log('ENHANCEMENT: ', props.enhancement);
  const { displayName } = props.enhancement;

  return (
    <div className={styles.EnhHoverMenu}>
      <div className={styles.menu}>
        <h2>{displayName}</h2>
      </div>
    </div>
  );
}

function SetPreviewMenu(props) {
  const stateManager = React.useContext(PlannerContext);
  const { display } = props;
  const { displayName, bonuses, enhancements, setTypeName, levels } = props.set;
  const setBonuses = stateManager.convertSetBonuses(bonuses);

  return (
    <div className={styles.EnhHoverMenu} style={{ display }}>
      <div
        className={styles.menu}
        style={{
          border: display && display !== 'null' ? '1px solid red' : null,
        }}
      >
        <div className={styles.titles}>
          <h2>
            {displayName}, {setTypeName}
          </h2>
          {/* <h3>Set Type: {setTypeName}</h3> */}
          <h3>{parseLevels(levels)}</h3>
        </div>
        <div className={styles.hoverContainer}>
          {/* <h3>Enhancements</h3> */}
          <div className={styles.enhancementContainer}>
            {enhancements.map(({ displayName }) => (
              <p key={displayName} className={styles.enhancementPill}>
                {displayName}
              </p>
            ))}
          </div>
        </div>
        <div className={styles.hoverContainer}>
          <h3>Set Bonuses</h3>
          {setBonuses.reduce((acc, { pve, pvp }, bonusIndex) => {
            // { display, effectName, path, unlocked, color? } = pve[i]/pvp[i]
            for (let i = 0; i < pve.length; i++) {
              acc.push(
                <div
                  key={'pve ' + bonusIndex}
                  className={styles.bonusContainer}
                >
                  <p>({pve[i][0].unlocked})</p>
                  <div className={styles.bonusText}>
                    {pve[i].map((item) => (
                      <p key={item.display}>
                        {/* {stateManager
                          .getBonusText(item.display, item.color)
                          .map(({ text, color }) => (
                            <span style={{ color }}>{text}</span>
                          ))} */}
                        {item.display}
                      </p>
                    ))}
                  </div>
                </div>
              );
              if (stateManager.getSetting('pvp') && pvp[i]) {
                acc.push(<p>{pvp[i].display}</p>);
              }
            }
            return acc;
          }, [])}
        </div>
      </div>
    </div>
  );
}

const parseLevels = ({ min, max }) => {
  return min === max ? `Level ${min}` : `Levels: ${min} - ${max}`;
};

export default PowerSlots;
