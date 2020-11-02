import React, { useState, useCallback } from "react";

import CloseOnOutsideClick from "../../wrappers/CloseOnOutsideClick.js";

import styles from "./styles.module.scss";

function Dropdown(props) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = props.options.find(({ value }) => value === props.selected);
  if (!selected) {
    console.log("SELECTED: ", props.selected, props.options);
  }
  const renderItem = (item = selected) => {
    return (
      <>
        {item.image && <img src={item.image} alt={item.alt || item.value} />}
        <p>{item.display || item.value}</p>
      </>
    );
  };

  const closeDD = useCallback(() => setIsOpen(false), []);
  const toggleDD = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  return (
    <CloseOnOutsideClick isOpen={isOpen} close={closeDD}>
      <div
        className={styles.Dropdown}
        data-name={props.name}
        onClick={toggleDD}
      >
        <div className={styles.select}>{renderItem()}</div>
        {isOpen && (
          <div style={{ position: "relative", zIndex: 1000 }}>
            <div className={styles.options}>
              {props.options.map((item) => (
                <div
                  onClick={(e) => {
                    e.target.name = props.name;
                    e.target.value = item.value;
                    props.onChange(e);
                  }}
                  key={item.key || item.value}
                  className={styles.option}
                >
                  {renderItem(item)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CloseOnOutsideClick>
  );
}

export default Dropdown;
