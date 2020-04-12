import { parse } from 'node-html-parser';

class Stack {
  constructor() {
    this.storage = [];
  }

  addNodes(nodes) {
    if (nodes && nodes.length) {
      for (let i = nodes.length - 1; i > -1; i--) {
        this.storage.push(nodes[i]);
      }
    }
  }

  getNode() {
    return this.storage.length ? this.storage.pop() : null;
  }

  getSize() {
    return this.storage.length;
  }
}

export default function parseStringToBuild(str) {
  const s = new Stack();
  const dom = parse(str);

  s.addNodes(dom.childNodes);

  const alreadyParsed = {};
  const build = {
    poolPowers: [],
    powerSets: {},
    epicPool: null,
    powers: [],
    enhancements: {},
  };

  while (s.getSize()) {
    const node = s.getNode();
    s.addNodes(node.childNodes);

    const { rawText: text } = node;

    if (!alreadyParsed[text] || text === ' (A) Empty') {
      alreadyParsed[text] = true;
      if (text && text !== '\n' && text !== '&nbsp;&nbsp;') {
        const action = getActionFromNode(node);

        if (action) {
          const actions = getActions();
          if (actions[action]) {
            actions[action](text, build);
          }
        }
      }
    }
  }

  return build;
}

function getActionFromNode({ rawText: text, tagName }) {
  const words = text.split(' ').filter((x) => x);

  if (words[0] === 'Level') {
    return text.indexOf(':') > -1
      ? words[1].indexOf('&nbsp;&nbsp;') > -1
        ? 'power'
        : null
      : 'archetype';
  } else if (isPowerSet(words)) {
    return 'powerSets';
  } else if (isPoolPower(words)) {
    return 'powerPool';
  } else if (words[1] === 'Profile:') {
    return 'alignment';
  } else if (isEnhancement(words, tagName)) {
    return 'enhancement';
  }

  return null;

  function isPowerSet(words) {
    return (
      words.length > 3 &&
      words[1] === 'Power' &&
      words[2] === 'Set:' &&
      (words[0] === 'Primary' || words[0] === 'Secondary')
    );
  }

  function isPoolPower(words) {
    return words.length > 2 && words[1] === 'Pool:';
  }

  function isEnhancement(words, tagName) {
    return (
      tagName === 'li' && (words.indexOf('-') > -1 || words.indexOf('IO') > -1)
    );
  }
}

function setArchetypeOriginAndLevel(text, build) {
  const keys = {
    1: 'level',
    2: 'origin',
    3: 'archetype',
  };

  text.split(' ').forEach((str, i) => {
    if (i > 0) {
      const key = keys[i];
      build[key] = str;
    }
  });

  return build;
}

function setPower(text, build) {
  const newPower = text.split('&nbsp;&nbsp;').reduce((acc, cur) => {
    if (cur.substring(0, 5) === 'Level') {
      acc.level = parseInt(cur.substring(5, cur.length - 1), 10);
    } else {
      acc.name = cur;
    }

    return acc;
  }, {});

  newPower.slots = [];
  newPower.type =
    build.powers.length < 5 || newPower.level > 4 ? 'selected' : 'default';

  build.powers.push(newPower);

  return build;
}

function setPowerSets(text, build) {
  const words = text.split(' ');
  const key = words[0].toLowerCase();

  const powerSet = words.slice(3).join(' ');

  build.powerSets[key] = powerSet;

  return build;
}

function setPowerPools(text, build) {
  const words = text.split(' ');
  const poolName = words.slice(2).join(' ');

  if (words[0] === 'Ancillary') {
    build.epicPool = poolName;
  } else {
    build.poolPowers.push(poolName);
  }

  return build;
}

function setAlignment(text, build) {
  build.alignment = text.split(' ')[0];
  return build;
}

function setEnhancement(text, build) {
  const words = text.split(' ').filter((x) => x);
  const slot = words.shift();
  const slotLevel = slot.substring(1, slot.length - 1);
  const dashIndex = words.indexOf('-');

  const enhInfo = { slotLevel: slotLevel === 'A' ? null : slotLevel };
  if (dashIndex > -1) {
    // io set
    enhInfo.setName = words.slice(0, dashIndex).join(' ');
    enhInfo.name = words.slice(dashIndex + 1).join(' ');
  } else {
    if (words[0] === 'Empty') {
      enhInfo.name = null;
    } else if (words.indexOf('IO') > -1) {
      enhInfo.setName = 'IOs';
      enhInfo.name = words.slice(0, words.length - 1).join(' ');
    }
  }

  const setInBuild = build.enhancements[enhInfo.setName];

  const lastPower = build.powers[build.powers.length - 1];
  lastPower.slots.push(enhInfo);

  if (setInBuild) {
    if (setInBuild[enhInfo.name]) {
      setInBuild.enhancements[enhInfo.name].need.push(lastPower.name);
    } else {
      setInBuild.enhancements[enhInfo.name] = {
        need: [lastPower.name],
        have: 0,
      };
    }
  } else {
    build.enhancements[enhInfo.setName] = {
      enhancements: {
        [enhInfo.name]: { need: [lastPower.name], have: 0 },
      },
      completed: false,
    };
  }
}

function getActions() {
  return {
    archetype: setArchetypeOriginAndLevel,
    power: setPower,
    powerSets: setPowerSets,
    powerPool: setPowerPools,
    alignment: setAlignment,
    enhancement: setEnhancement,
  };
}
