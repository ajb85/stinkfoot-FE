import React, { useContext, useEffect } from 'react';

import styles from './styles.module.scss';
import { DDTrackingContext } from 'Providers/DropdownTracking.js';

function Dropdown(props) {
  const { dropdowns, addDropdown, removeDropdown } = useContext(
    DDTrackingContext
  );
  const selected = props.options.find(({ value }) => value === props.selected);
  useEffect(() => {
    addDropdown(props.name);

    return removeDropdown.bind(this, props.name);
    // eslint-disable-next-line
  }, []);

  const isToggled = dropdowns[props.name];

  const renderItem = (item = selected) => {
    return (
      <>
        {item.image && <img src={item.image} alt={item.alt || item.value} />}
        <p>{item.display || item.value}</p>
      </>
    );
  };

  return (
    <div className={styles.Dropdown} data-name={props.name}>
      <div className={styles.select} style={{ width: props.width || 150 }}>
        {renderItem()}
      </div>
      {isToggled && (
        <div style={{ position: 'relative', zIndex: 1000 }}>
          <div className={styles.options}>
            {props.options
              //   .filter(
              //     ({ value }) => props.showSelected || value !== selected.value
              //   )
              .map((item) => (
                <div
                  onClick={(e) => {
                    e.target.name = props.name;
                    e.target.value = item.value;
                    props.onChange(e);
                  }}
                  key={item.key || item.value}
                  className={styles.option}
                  style={{ width: props.width || 150 }}
                >
                  {renderItem(item)}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
