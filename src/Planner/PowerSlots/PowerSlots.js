import React, { useState } from 'react';

import PowerSlot from './PowerSlot/';

import { usePlannerState } from 'Providers/PlannerStateManagement.js';

import styles from './styles.module.scss';

function PowerSlots(props) {
  const [view] = useState('level');
  const enhNavigation = useState({
    section: 'standard',
    tier: 'IO',
    ioSetIndex: null,
    showSuperior: true,
  });

  const stateManager = usePlannerState();

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
    .reduce(reducer(view), getInitialAcc());

  return (
    <section className={styles.PowerSlots}>
      <h2>Power Slots</h2>
      <div className={styles.slotsContainer}>
        {selected.map((column, columnNumber) => {
          return (
            <div key={columnNumber} className={styles.column}>
              {column.map((ps) => (
                <PowerSlot
                  key={ps.powerSlotIndex}
                  slot={ps}
                  selectionState={enhNavigation}
                />
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

const reducer = (view, index = 0) => (acc, cur, powerSlotIndex) => {
  const psWithIndex = { ...cur, powerSlotIndex };
  if (cur.type === 'default') {
    acc.defaults.push(psWithIndex);
  } else if (view === 'level') {
    acc.selected[index].push(psWithIndex);
    if (acc.selected[index].length >= 8) {
      index++;
    }
  } else if (view === 'respec') {
    const { power } = psWithIndex;
    if (!power) {
      acc.empties.push(psWithIndex);
    } else {
      const ato = power.archetypeOrder;
      const atoIndex = ato === 'primary' ? 0 : ato === 'secondary' ? 1 : 2;

      acc.selected[atoIndex].push(psWithIndex);
    }
  }
  return acc;
};

const getInitialAcc = () => ({
  selected: [[], [], []],
  defaults: [],
  empties: [],
});

export default PowerSlots;
