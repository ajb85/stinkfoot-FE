import React, { useState, createContext, useEffect } from 'react';

import styles from 'Planner/UI/Dropdown/styles.module.scss';

export const DDTrackingContext = createContext();

function BuildProvider(props) {
  const [dropdowns, setDropdowns] = useState({});
  const dropdownsMutate = {};

  useEffect(() => {
    const toggleDropdown = (e) => {
      const name = searchNodeForDropdownDiv(e.target);

      for (let n in dropdownsMutate) {
        dropdownsMutate[n] = n === name ? !dropdownsMutate[name] : false;
      }
      setDropdowns({ ...dropdownsMutate });
    };

    window.addEventListener('click', toggleDropdown);

    return window.removeEventListener.bind(this, 'click', toggleDropdown);
    // eslint-disable-next-line
  }, []);

  const { Provider } = DDTrackingContext;
  return (
    <Provider
      value={{
        dropdowns,
        setDropdowns,
        addDropdown: addDropdown.bind(this, dropdownsMutate, setDropdowns),
        removeDropdown: removeDropdown.bind(
          this,
          dropdownsMutate,
          setDropdowns
        ),
      }}
    >
      {props.children}
    </Provider>
  );
}

function searchNodeForDropdownDiv(node) {
  const childNode = () => {
    if (
      node.className === styles.select &&
      node.parentNode &&
      node.parentNode.dataset &&
      node.parentNode.dataset.name
    ) {
      return node.parentNode.dataset.name;
    }
  };

  const grandChildNode = () => {
    if (
      node.parentNode &&
      node.parentNode.parentNode &&
      node.parentNode.parentNode.dataset &&
      node.parentNode.parentNode.dataset.name
    ) {
      return node.parentNode.parentNode.dataset.name;
    }
  };

  const targetChildren = {
    DIV: childNode,
    IMG: grandChildNode,
    P: grandChildNode,
  };

  return targetChildren[node.tagName] ? targetChildren[node.tagName]() : null;
}

function addDropdown(dropdowns, setDropdowns, name) {
  if (!dropdowns[name]) {
    setDropdowns({ ...dropdowns, [name]: false });
    dropdowns[name] = false;
  } else {
    console.log('ATTEMPTED TO ADD SECOND DROPDOWN UNDER NAME: ', name);
  }
}

function removeDropdown(dropdowns, setDropdowns, name) {
  delete dropdowns[name];
  setDropdowns({ ...dropdowns });
}

export default BuildProvider;
