import React, { useState, createContext } from 'react';

export const BuildContext = createContext();

function BuildProvider(props) {
  const [build, setBuild] = useState({});

  const saveBuild = str => {
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
        console.log('CONTENT: ', contentStr, isValidContent(contentStr));
        if (isValidContent(contentStr)) {
          content.push(contentStr);
          i = contentStart + distanceToClosingTag + distanceToEndClosingTag;
        }
      }
    }
    const groomedContent = formatData(content);
    setBuild(groomedContent);
  };
  const { Provider } = BuildContext;
  return <Provider value={{ build, saveBuild }}>{props.children}</Provider>;
}

export default BuildProvider;

function isValidContent(str) {
  const badContentStarts = {
    '<': true,
    ':': true
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
        const setEnhancements = updated[setName];
        setEnhancements[arr[i + 1]] = setEnhancements[arr[i + 1]]
          ? setEnhancements[arr[i + 1]] + 1
          : 1;
      } else {
        updated[setName] = { [arr[i + 1]]: 1 };
      }
      i += 1;
    }
  }
  return updated;
}
