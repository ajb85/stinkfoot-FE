import React, { useState, createContext, useEffect } from 'react';

import styles from 'Planner/UI/Dropdown/styles.module.scss';

export const DDTrackingContext = createContext();

const dropdownsMutate = {};
function BuildProvider(props) {
  const [dropdowns, setDropdowns] = useState({});

  useEffect(() => {
    const toggleDropdown = (e) => {
      const name = searchNodeForDropdownDiv(e.target);

      for (let n in dropdownsMutate) {
        if (n === name) {
          updateMutate('toggle', n);
        } else {
          updateMutate('clear', n);
        }
      }

      setDropdowns({ ...dropdownsMutate });
    };

    window.addEventListener('click', toggleDropdown);

    return window.removeEventListener.bind(this, 'click', toggleDropdown);
    // eslint-disable-next-line
  }, []);

  function addDropdown(name) {
    const dds = { ...dropdowns };
    if (!dds[name]) {
      updateMutate('add', name);
      setDropdowns({ ...dds, [name]: false });
    } else {
      console.log('ATTEMPTED TO ADD SECOND DROPDOWN UNDER NAME: ', name);
    }
  }

  function removeDropdown(name) {
    const dds = { ...dropdowns };
    updateMutate('remove', name);
    delete dds[name];
    setDropdowns({ ...dds });
  }

  const { Provider } = DDTrackingContext;
  return (
    <Provider
      value={{
        dropdowns,
        setDropdowns,
        addDropdown,
        removeDropdown,
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

function updateMutate(operation, name) {
  switch (operation) {
    case 'remove':
      return delete dropdownsMutate[name];
    case 'add':
      dropdownsMutate[name] = false;
      return true;
    case 'toggle':
      dropdownsMutate[name] = !dropdownsMutate[name];
      return true;
    case 'clear':
      dropdownsMutate[name] = false;
      return true;
    default:
      return false;
  }
}

export default BuildProvider;
