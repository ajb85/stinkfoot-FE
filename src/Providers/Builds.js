import React, { useState, createContext } from 'react';

export const BuildContext = createContext();

function BuildProvider(props) {
  const currentBuild = updateOldDataStructures(
    localStorage.getItem('currentBuild')
  );

  const [build, setBuild] = useState(currentBuild ? currentBuild : {});

  const saveBuild = (str) => {
    if (!str) {
      setBuild({});
      return;
    }
    const content = parseStringIntoContent(str);
    localStorage.setItem('currentBuild', JSON.stringify(content));
    setBuild(content);
  };

  const _saveUpdatedBuild = (newEnh, setName) => {
    let isComplete = true;

    for (let eName in newEnh) {
      const enh = newEnh[eName];
      if (enh.have < enh.need) {
        isComplete = false;
      }
    }

    const newBuild = {
      ...build,
      [setName]: { ...build[setName], enhancements: newEnh },
      completed: isComplete,
    };

    localStorage.setItem('currentBuild', JSON.stringify(newBuild));
    setBuild(newBuild);
  };

  const toggleEnhancement = (setName, enhName) => {
    const enh = build[setName].enhancements[enhName];
    const updatedSet = {
      ...build[setName].enhancements,
      [enhName]: {
        ...enh,
        have: enh.have < enh.need ? enh.need : 0,
      },
    };

    _saveUpdatedBuild(updatedSet, setName);
  };

  const decrementCount = (setName, enhName) => {
    const set = { ...build[setName].enhancements };
    set[enhName].have =
      set[enhName].have < set[enhName].need
        ? set[enhName].have + 1
        : set[enhName].need;

    _saveUpdatedBuild(set, setName);
  };

  const toggleSet = (setName) => {
    const setCopy = { ...build[setName] };
    setCopy.completed = !setCopy.completed;
    const isComplete = setCopy.completed;

    const enhancements = { ...setCopy.enhancements };
    for (let enhName in enhancements) {
      const enh = setCopy.enhancements[enhName];
      enh.have = isComplete ? enh.need : 0;
    }

    const newBuild = { ...build, [setName]: { ...setCopy, enhancements } };
    localStorage.setItem('currentBuild', JSON.stringify(newBuild));
    setBuild(newBuild);
  };

  const { Provider } = BuildContext;
  return (
    <Provider
      value={{ build, saveBuild, toggleEnhancement, toggleSet, decrementCount }}
    >
      {props.children}
    </Provider>
  );
}

export default BuildProvider;

function parseStringIntoContent(str) {
  const content = [];
  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (char === '<' && str.substring(i, i + 5) === '<font') {
      const distanceToClosingBracket = str.substring(i + 5).indexOf('>');
      const contentStart = i + 6 + distanceToClosingBracket;
      const distanceToClosingTag = str
        .substring(contentStart)
        .indexOf('</font>');
      const distanceToEndClosingTag = str
        .substring(contentStart + distanceToClosingTag)
        .indexOf('>');
      const contentStr = str.substring(
        contentStart,
        contentStart + distanceToClosingTag
      );
      if (isValidContent(contentStr)) {
        content.push(contentStr);
        i = contentStart + distanceToClosingTag + distanceToEndClosingTag;
      }
    }
  }

  return formatData(content);
}

function isValidContent(str) {
  const badContentStarts = {
    '<': true,
    ':': true,
  };
  return !badContentStarts[str[0]] && str.substring(0, 5) !== 'Level';
}

function formatData(arr) {
  const updated = {};

  for (let i = 4; i < arr.length; i++) {
    const content = arr[i];
    if (content === 'Power Pool: ') {
      i += 1;
    } else if (content.indexOf(' - ') > -1) {
      const setName = content.substring(0, content.indexOf(' - '));
      if (updated[setName]) {
        const setEnhancements = updated[setName].enhancements;
        if (setEnhancements[arr[i + 1]]) {
          setEnhancements[arr[i + 1]].need++;
        } else {
          setEnhancements[arr[i + 1]] = { need: 1, have: 0 };
        }
      } else {
        updated[setName] = {
          enhancements: { [arr[i + 1]]: { need: 1, have: 0 } },
          completed: false,
        };
      }
      i += 1;
    }
  }
  return updated;
}

function updateOldDataStructures(build) {
  if (!build) {
    return null;
  }

  if (typeof build === 'string') {
    build = JSON.parse(build);
  }

  if (build.hasOwnProperty('completed')) {
    delete build.completed;
  }

  for (let setName in build) {
    const set = build[setName];
    if (!set.enhancements) {
      return _modernizeStructure(build);
    }
  }

  return build;
}

function _modernizeStructure(build) {
  // Assumes build exists & is an object

  const buildCopy = { ...build };
  const updatedBuild = {};

  for (let setName in buildCopy) {
    const _set = buildCopy[setName];
    const { completed, ...enhancements } = _set;
    const updatedSet = { enhancements, completed };

    for (let eName in enhancements) {
      const enh = enhancements[eName];
      const { completed, count: need } = enh;

      updatedSet.enhancements[eName] = { need, have: completed ? need : 0 };
    }
    updatedBuild[setName] = updatedSet;
  }

  return updatedBuild;
}
