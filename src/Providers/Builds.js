import React, { useState, createContext } from 'react';

export const BuildContext = createContext();

function BuildProvider(props) {
  const [build, setBuild] = useState({});

  const saveBuild = str => {
    if (!str) {
      setBuild({});
      return;
    }
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
    const groomedContent = formatData(content);
    localStorage.setItem('currentBuild', JSON.stringify(groomedContent));
    setBuild(groomedContent);
  };

  const toggleEnhancement = (setName, enhName) => {
    let isComplete = true;

    const updatedSet = {
      ...build[setName],
      [enhName]: {
        ...build[setName][enhName],
        completed: !build[setName][enhName].completed
      }
    };

    for (let eName in updatedSet) {
      const enh = updatedSet[eName];
      if (eName !== 'completed' && !enh.completed) {
        isComplete = false;
      }
    }

    updatedSet.completed = isComplete;

    const newBuild = {
      ...build,
      [setName]: updatedSet
    };

    localStorage.setItem('currentBuild', JSON.stringify(newBuild));
    setBuild(newBuild);
  };

  const toggleSet = setName => {
    const setCopy = { ...build[setName] };
    setCopy.completed = !setCopy.completed;
    const isComplete = setCopy.completed;
    for (let enhName in setCopy) {
      if (enhName !== 'completed') {
        const enh = setCopy[enhName];
        enh.completed = isComplete;
      }
    }
    const newBuild = { ...build, [setName]: setCopy };
    localStorage.setItem('currentBuild', JSON.stringify(newBuild));
    setBuild(newBuild);
  };

  React.useEffect(() => {
    if (
      process.env.REACT_APP_ENV &&
      process.env.REACT_APP_ENV.toLowerCase() === 'dev'
    ) {
      saveBuild(dummyBuild);
    } else if (localStorage.getItem('currentBuild')) {
      saveBuild(JSON.parse(localStorage.getItem('currentBuild')));
    }
  }, []);
  const { Provider } = BuildContext;
  return (
    <Provider value={{ build, saveBuild, toggleEnhancement, toggleSet }}>
      {props.children}
    </Provider>
  );
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
        if (setEnhancements[arr[i + 1]]) {
          setEnhancements[arr[i + 1]].count++;
        } else {
          setEnhancements[arr[i + 1]] = { count: 1, completed: false };
        }
      } else {
        updated[setName] = {
          [arr[i + 1]]: { count: 1, completed: false },
          completed: false
        };
      }
      i += 1;
    }
  }
  return updated;
}

const dummyBuild = `<font color="#489AFF"><b>Hero Plan by Hero Hero Designer 2.23</b></font><br />
<font color="#489AFF"><b>https://github.com/ImaginaryDevelopment/imaginary-hero-designer</b></font><br />
<br />
<font color="#B1C9F5"><u><b><a href="http://www.cohplanner.com/mids/download.php?uc=1449&c=662&a=1324&f=HEX&dc=78DA6594594F53511485CF6D6FC596222DB450E67996D23238448D5111A2D284449F542C37F5888DD8620B467C33714CFC0FC6F82C0E71FC09CE3E39FE0606F5C10487BAB96BA5C1F4A6EDD7B3CE59FB9CBDF7BD377661D8BB307A69B732BCFBA6AD6C367EC44A9DD11957CC9A4A26D4DA5524DF10D4F8B03EA553591D3E90D0F13D99B3E94C3527627A5AEBF07836994E25131829CF783A3D1D3E3CA3F5C912FBEF4872EAF46C3235F5FFC86B8FC6B4352383E0FE996422BC373337ABE3B1B978CCCACEEACC7C488ED02EDF176EF931D60E9573A925A75251533996C915D0FC467E0737FC007FB6295E39431D1574982A7A0C7C29710DC63522067C5170633F39007A06C921B045EAE3445CE5EC55B6F64AE2B918CF7517EBBC0BE43D70D37DF201E87B08BE166F11BCAAA809F1DE88E6A6E6EE473E6F452BE61EC51FA0F93E82659FC8CF60E00B58F1155C955A94B01625E71CB6D69A027FC95C29E65CA5974D5B6BBA02B65E057BAF91D7C1BE1BE03B39931F6772FA47B8E728D874883C08364BDDCAB1D628EF419E01D2217341D634580DCD295A25D69B95EC51883D0AB127D5EC51077B668AA78A9E2A1FD7F8C1C632324006C1F792438DE1B1F3AFA1A7969E5A7AEACB497AEBE9FD23B5AB63EDEA8EA39E1D1360F70970739C9C242DF0B7781BE07534DC82D67B1B8CDE0127A574CD586336F7436B192087C82DECE756302771DBE869DB06AD7D3BB983DCC9B3EE022DD9A79379743E426FBB1E934FC8A760F733F239F85736EBE1BDD5C3E7AC6F02BC297361E6183E8FBEF6CD83D18B6085F42CC27B3DC2BAD69AF967573E72A92E33FF26C87517CC460A9468813250A00C16286305CAB8C96D45316CC5EDCB3FFFB9454FFE3DA20CBE0B96D76B8BB8F797D66B9D58B7B25E6B84B65A216096FF003646DFF3">Click this DataLink to open the build!</a></b></u></font><br />
<br />
<b><font color="#B3CAF7">Level 50 Magic Tanker</font></b><br />
<b><font color="#489AFF">Primary Power Set: </font><font color="#B3CAF7">Ice Armor</font></b><br />
<b><font color="#489AFF">Secondary Power Set: </font><font color="#B3CAF7">Psionic Melee</font></b><br />
<b><font color="#489AFF">Power Pool: </font><font color="#B3CAF7">Speed</font></b><br />
<b><font color="#489AFF">Power Pool: </font><font color="#B3CAF7">Fighting</font></b><br />
<b><font color="#489AFF">Power Pool: </font><font color="#B3CAF7">Leaping</font></b><br />
<b><font color="#489AFF">Ancillary Pool: </font><font color="#B3CAF7">Mu Mastery</font></b><br />
<br />
<font color="#489AFF"><b>Hero Profile:</b></font><br />
<b><font color="#4FA7FF">Level 1:</font>&nbsp;&nbsp;<font color="#B3CAF7">Frozen Armor</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Reactive Defenses - </font><font color="#7AA4EF">Defense</font></li>
<li> (3) <font color="#7AA4EF">Reactive Defenses - </font><font color="#7AA4EF">Defense/Endurance</font></li>
<li> (3) <font color="#7AA4EF">Reactive Defenses - </font><font color="#7AA4EF">Endurance/RechargeTime</font></li>
<li> (5) <font color="#7AA4EF">Reactive Defenses - </font><font color="#7AA4EF">Defense/RechargeTime</font></li>
<li> (5) <font color="#7AA4EF">Reactive Defenses - </font><font color="#7AA4EF">Defense/Endurance/RechargeTime</font></li>
<li> (7) <font color="#7AA4EF">Reactive Defenses - </font><font color="#7AA4EF">Scaling Resist Damage</font></li>
</ul><b><font color="#4FA7FF">Level 1:</font>&nbsp;&nbsp;<font color="#B3CAF7">Mental Strike</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Touch of Death - </font><font color="#7AA4EF">Accuracy/Damage</font></li>
<li> (50) <font color="#7AA4EF">Touch of Death - </font><font color="#7AA4EF">Damage/Endurance</font></li>
</ul><b><font color="#4FA7FF">Level 2:</font>&nbsp;&nbsp;<font color="#B3CAF7">Hoarfrost</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Aegis - </font><font color="#7AA4EF">Resistance/Endurance</font></li>
<li> (7) <font color="#7AA4EF">Aegis - </font><font color="#7AA4EF">Resistance/Recharge</font></li>
<li> (9) <font color="#7AA4EF">Aegis - </font><font color="#7AA4EF">Endurance/Recharge</font></li>
<li> (9) <font color="#7AA4EF">Aegis - </font><font color="#7AA4EF">Resistance/Endurance/Recharge</font></li>
<li> (11) <font color="#7AA4EF">Aegis - </font><font color="#7AA4EF">Resistance</font></li>
<li> (11) <font color="#7AA4EF">Aegis - </font><font color="#7AA4EF">Psionic/Status Resistance</font></li>
</ul><b><font color="#4FA7FF">Level 4:</font>&nbsp;&nbsp;<font color="#B3CAF7">Super Speed</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#8BAFF1">Run Speed</font><font color="#8BAFF1"> IO</font></li>
</ul><b><font color="#4FA7FF">Level 6:</font>&nbsp;&nbsp;<font color="#B3CAF7">Chilling Embrace</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Pacing of the Turtle - </font><font color="#7AA4EF">Accuracy/Slow</font></li>
<li> (13) <font color="#7AA4EF">Pacing of the Turtle - </font><font color="#7AA4EF">Damage/Slow</font></li>
<li> (13) <font color="#7AA4EF">Pacing of the Turtle - </font><font color="#7AA4EF">Accuracy/Endurance</font></li>
<li> (15) <font color="#7AA4EF">Pacing of the Turtle - </font><font color="#7AA4EF">Range/Slow</font></li>
<li> (15) <font color="#7AA4EF">Pacing of the Turtle - </font><font color="#7AA4EF">Endurance/Recharge/Slow</font></li>
<li> (17) <font color="#7AA4EF">Pacing of the Turtle - </font><font color="#7AA4EF">Chance of -Recharge</font></li>
</ul><b><font color="#4FA7FF">Level 8:</font>&nbsp;&nbsp;<font color="#B3CAF7">Wet Ice</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#8BAFF1">Endurance Reduction</font><font color="#8BAFF1"> IO</font></li>
</ul><b><font color="#4FA7FF">Level 10:</font>&nbsp;&nbsp;<font color="#B3CAF7">Permafrost</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Gladiator's Armor - </font><font color="#7AA4EF">TP Protection +3% Def (All)</font></li>
</ul><b><font color="#4FA7FF">Level 12:</font>&nbsp;&nbsp;<font color="#B3CAF7">Icicles</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Superior Might of the Tanker - </font><font color="#7AA4EF">Accuracy/Damage</font></li>
<li> (17) <font color="#7AA4EF">Superior Might of the Tanker - </font><font color="#7AA4EF">Damage/Recharge</font></li>
<li> (19) <font color="#7AA4EF">Superior Might of the Tanker - </font><font color="#7AA4EF">Accuracy/Damage/Recharge</font></li>
<li> (19) <font color="#7AA4EF">Superior Might of the Tanker - </font><font color="#7AA4EF">Damage/Endurance/Recharge</font></li>
<li> (21) <font color="#7AA4EF">Superior Might of the Tanker - </font><font color="#7AA4EF">Accuracy/Damage/Endurance/Recharge</font></li>
<li> (23) <font color="#7AA4EF">Superior Might of the Tanker - </font><font color="#7AA4EF">Recharge/Chance for +Res(All)</font></li>
</ul><b><font color="#4FA7FF">Level 14:</font>&nbsp;&nbsp;<font color="#B3CAF7">Taunt</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Perfect Zinger - </font><font color="#7AA4EF">Accuracy/Recharge</font></li>
<li> (37) <font color="#7AA4EF">Perfect Zinger - </font><font color="#7AA4EF">Taunt</font></li>
</ul><b><font color="#4FA7FF">Level 16:</font>&nbsp;&nbsp;<font color="#B3CAF7">Psi Blade Sweep</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Superior Gauntleted Fist - </font><font color="#7AA4EF">Accuracy/Damage</font></li>
<li> (34) <font color="#7AA4EF">Superior Gauntleted Fist - </font><font color="#7AA4EF">Damage/RechargeTime</font></li>
<li> (37) <font color="#7AA4EF">Superior Gauntleted Fist - </font><font color="#7AA4EF">Accuracy/Damage/RechargeTime</font></li>
<li> (46) <font color="#7AA4EF">Superior Gauntleted Fist - </font><font color="#7AA4EF">Damage/Endurance/RechargeTime</font></li>
<li> (46) <font color="#7AA4EF">Superior Gauntleted Fist - </font><font color="#7AA4EF">Accuracy/Damage/Endurance/RechargeTime</font></li>
<li> (48) <font color="#7AA4EF">Superior Gauntleted Fist - </font><font color="#7AA4EF">RechargeTime/+Absorb</font></li>
</ul><b><font color="#4FA7FF">Level 18:</font>&nbsp;&nbsp;<font color="#B3CAF7">Glacial Armor</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Shield Wall - </font><font color="#7AA4EF">Defense/Endurance</font></li>
<li> (23) <font color="#7AA4EF">Shield Wall - </font><font color="#7AA4EF">Defense/Recharge</font></li>
<li> (34) <font color="#7AA4EF">Shield Wall - </font><font color="#7AA4EF">+Res (Teleportation), +5% Res (All)</font></li>
<li> (34) <font color="#7AA4EF">Shield Wall - </font><font color="#7AA4EF">Defense</font></li>
</ul><b><font color="#4FA7FF">Level 20:</font>&nbsp;&nbsp;<font color="#B3CAF7">Hasten</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#8BAFF1">Recharge Reduction</font><font color="#8BAFF1"> IO</font></li>
<li> (21) <font color="#8BAFF1">Recharge Reduction</font><font color="#8BAFF1"> IO</font></li>
</ul><b><font color="#4FA7FF">Level 22:</font>&nbsp;&nbsp;<font color="#B3CAF7">Kick</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#8BAFF1">Accuracy</font><font color="#8BAFF1"> IO</font></li>
</ul><b><font color="#4FA7FF">Level 24:</font>&nbsp;&nbsp;<font color="#B3CAF7">Tough</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Aegis - </font><font color="#7AA4EF">Resistance/Endurance</font></li>
<li> (25) <font color="#7AA4EF">Aegis - </font><font color="#7AA4EF">Resistance/Recharge</font></li>
<li> (25) <font color="#7AA4EF">Aegis - </font><font color="#7AA4EF">Resistance</font></li>
<li> (27) <font color="#7AA4EF">Aegis - </font><font color="#7AA4EF">Resistance/Endurance/Recharge</font></li>
<li> (40) <font color="#7AA4EF">Aegis - </font><font color="#7AA4EF">Endurance/Recharge</font></li>
</ul><b><font color="#4FA7FF">Level 26:</font>&nbsp;&nbsp;<font color="#B3CAF7">Weave</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Luck of the Gambler - </font><font color="#7AA4EF">Defense/Endurance</font></li>
<li> (27) <font color="#7AA4EF">Luck of the Gambler - </font><font color="#7AA4EF">Defense/Recharge</font></li>
<li> (33) <font color="#7AA4EF">Luck of the Gambler - </font><font color="#7AA4EF">Endurance/Recharge</font></li>
<li> (33) <font color="#7AA4EF">Luck of the Gambler - </font><font color="#7AA4EF">Defense</font></li>
<li> (33) <font color="#7AA4EF">Luck of the Gambler - </font><font color="#7AA4EF">Recharge Speed</font></li>
</ul><b><font color="#4FA7FF">Level 28:</font>&nbsp;&nbsp;<font color="#B3CAF7">Energy Absorption</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Luck of the Gambler - </font><font color="#7AA4EF">Defense/Endurance</font></li>
<li> (29) <font color="#7AA4EF">Luck of the Gambler - </font><font color="#7AA4EF">Defense/Recharge</font></li>
<li> (29) <font color="#7AA4EF">Luck of the Gambler - </font><font color="#7AA4EF">Endurance/Recharge</font></li>
<li> (31) <font color="#7AA4EF">Luck of the Gambler - </font><font color="#7AA4EF">Defense/Endurance/Recharge</font></li>
<li> (31) <font color="#7AA4EF">Luck of the Gambler - </font><font color="#7AA4EF">Defense</font></li>
<li> (31) <font color="#7AA4EF">Luck of the Gambler - </font><font color="#7AA4EF">Recharge Speed</font></li>
</ul><b><font color="#4FA7FF">Level 30:</font>&nbsp;&nbsp;<font color="#B3CAF7">Boggle</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Coercive Persuasion  - </font><font color="#7AA4EF">Confused</font></li>
<li> (40) <font color="#7AA4EF">Coercive Persuasion  - </font><font color="#7AA4EF">Confused/Recharge</font></li>
<li> (43) <font color="#7AA4EF">Coercive Persuasion  - </font><font color="#7AA4EF">Accuracy/Confused/Recharge</font></li>
<li> (45) <font color="#7AA4EF">Coercive Persuasion  - </font><font color="#7AA4EF">Accuracy/Recharge</font></li>
<li> (45) <font color="#7AA4EF">Coercive Persuasion  - </font><font color="#7AA4EF">Confused/Endurance</font></li>
<li> (45) <font color="#7AA4EF">Coercive Persuasion  - </font><font color="#7AA4EF">Contagious Confusion</font></li>
</ul><b><font color="#4FA7FF">Level 32:</font>&nbsp;&nbsp;<font color="#B3CAF7">Concentration</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Adjusted Targeting - </font><font color="#7AA4EF">To Hit Buff/Recharge</font></li>
<li> (46) <font color="#7AA4EF">Adjusted Targeting - </font><font color="#7AA4EF">Endurance/Recharge</font></li>
<li> (50) <font color="#7AA4EF">Adjusted Targeting - </font><font color="#7AA4EF">Recharge</font></li>
</ul><b><font color="#4FA7FF">Level 35:</font>&nbsp;&nbsp;<font color="#B3CAF7">Electrifying Fences</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Ragnarok - </font><font color="#7AA4EF">Damage</font></li>
<li> (36) <font color="#7AA4EF">Ragnarok - </font><font color="#7AA4EF">Damage/Recharge</font></li>
<li> (36) <font color="#7AA4EF">Ragnarok - </font><font color="#7AA4EF">Accuracy/Recharge</font></li>
<li> (36) <font color="#7AA4EF">Ragnarok - </font><font color="#7AA4EF">Damage/Endurance</font></li>
<li> (37) <font color="#7AA4EF">Ragnarok - </font><font color="#7AA4EF">Chance for Knockdown</font></li>
</ul><b><font color="#4FA7FF">Level 38:</font>&nbsp;&nbsp;<font color="#B3CAF7">Mass Levitate</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Armageddon - </font><font color="#7AA4EF">Damage</font></li>
<li> (39) <font color="#7AA4EF">Armageddon - </font><font color="#7AA4EF">Damage/Recharge</font></li>
<li> (39) <font color="#7AA4EF">Armageddon - </font><font color="#7AA4EF">Accuracy/Recharge</font></li>
<li> (39) <font color="#7AA4EF">Armageddon - </font><font color="#7AA4EF">Damage/Endurance</font></li>
<li> (40) <font color="#7AA4EF">Armageddon - </font><font color="#7AA4EF">Chance for Fire Damage</font></li>
</ul><b><font color="#4FA7FF">Level 41:</font>&nbsp;&nbsp;<font color="#B3CAF7">Ball Lightning</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Superior Frozen Blast - </font><font color="#7AA4EF">Accuracy/Damage</font></li>
<li> (42) <font color="#7AA4EF">Superior Frozen Blast - </font><font color="#7AA4EF">Damage/Endurance</font></li>
<li> (42) <font color="#7AA4EF">Superior Frozen Blast - </font><font color="#7AA4EF">Accuracy/Damage/Endurance</font></li>
<li> (42) <font color="#7AA4EF">Superior Frozen Blast - </font><font color="#7AA4EF">Accuracy/Damage/Recharge</font></li>
<li> (43) <font color="#7AA4EF">Superior Frozen Blast - </font><font color="#7AA4EF">Damage/Endurance/Accuracy/RechargeTime</font></li>
<li> (43) <font color="#7AA4EF">Superior Frozen Blast - </font><font color="#7AA4EF">Recharge/Chance for Immobilize</font></li>
</ul><b><font color="#4FA7FF">Level 44:</font>&nbsp;&nbsp;<font color="#B3CAF7">Greater Psi Blade</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Touch of Death - </font><font color="#7AA4EF">Accuracy/Damage</font></li>
<li> (48) <font color="#7AA4EF">Touch of Death - </font><font color="#7AA4EF">Accuracy/Damage/Endurance</font></li>
</ul><b><font color="#4FA7FF">Level 47:</font>&nbsp;&nbsp;<font color="#B3CAF7">Cross Punch</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Scirocco's Dervish - </font><font color="#7AA4EF">Accuracy/Damage</font></li>
<li> (48) <font color="#7AA4EF">Scirocco's Dervish - </font><font color="#7AA4EF">Accuracy/Recharge</font></li>
<li> (50) <font color="#7AA4EF">Scirocco's Dervish - </font><font color="#7AA4EF">Accuracy/Damage/Endurance</font></li>
</ul><b><font color="#4FA7FF">Level 49:</font>&nbsp;&nbsp;<font color="#B3CAF7">Combat Jumping</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Luck of the Gambler - </font><font color="#7AA4EF">Recharge Speed</font></li>
</ul><b><font color="#4FA7FF">Level 1:</font>&nbsp;&nbsp;<font color="#B3CAF7">Brawl</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#5EAEFF">Empty</font></li>
</ul><b><font color="#4FA7FF">Level 1:</font>&nbsp;&nbsp;<font color="#B3CAF7">Gauntlet</font></b>&nbsp;&nbsp;<br />
<b><font color="#4FA7FF">Level 1:</font>&nbsp;&nbsp;<font color="#B3CAF7">Prestige Power Dash</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#5EAEFF">Empty</font></li>
</ul><b><font color="#4FA7FF">Level 1:</font>&nbsp;&nbsp;<font color="#B3CAF7">Prestige Power Slide</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#5EAEFF">Empty</font></li>
</ul><b><font color="#4FA7FF">Level 1:</font>&nbsp;&nbsp;<font color="#B3CAF7">Prestige Power Quick</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#5EAEFF">Empty</font></li>
</ul><b><font color="#4FA7FF">Level 1:</font>&nbsp;&nbsp;<font color="#B3CAF7">Prestige Power Rush</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#5EAEFF">Empty</font></li>
</ul><b><font color="#4FA7FF">Level 1:</font>&nbsp;&nbsp;<font color="#B3CAF7">Prestige Power Surge</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#5EAEFF">Empty</font></li>
</ul><b><font color="#4FA7FF">Level 1:</font>&nbsp;&nbsp;<font color="#B3CAF7">Sprint</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#5EAEFF">Empty</font></li>
</ul><b><font color="#4FA7FF">Level 2:</font>&nbsp;&nbsp;<font color="#B3CAF7">Rest</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#5EAEFF">Empty</font></li>
</ul><b><font color="#4FA7FF">Level 4:</font>&nbsp;&nbsp;<font color="#B3CAF7">Ninja Run</font></b>&nbsp;&nbsp;<br />
<b><font color="#4FA7FF">Level 2:</font>&nbsp;&nbsp;<font color="#B3CAF7">Swift</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#8BAFF1">Run Speed</font><font color="#8BAFF1"> IO</font></li>
</ul><b><font color="#4FA7FF">Level 2:</font>&nbsp;&nbsp;<font color="#B3CAF7">Health</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#7AA4EF">Preventive Medicine - </font><font color="#7AA4EF">Chance for +Absorb</font></li>
</ul><b><font color="#4FA7FF">Level 2:</font>&nbsp;&nbsp;<font color="#B3CAF7">Hurdle</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#8BAFF1">Jumping</font><font color="#8BAFF1"> IO</font></li>
</ul><b><font color="#4FA7FF">Level 2:</font>&nbsp;&nbsp;<font color="#B3CAF7">Stamina</font></b>&nbsp;&nbsp;<ul><li> (A) <font color="#8BAFF1">Endurance Modification</font><font color="#8BAFF1"> IO</font></li>
</ul><b><font color="#4FA7FF">Level 50:</font>&nbsp;&nbsp;<font color="#B3CAF7">Agility Core Paragon</font></b>&nbsp;&nbsp;<br />
<font color="#489AFF">------------</font><br />
<br />
`;
