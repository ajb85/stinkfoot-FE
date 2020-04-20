import React, { useState } from 'react';

import SelectAT from './SelectAT/';
import Powersets from './Powersets/';

import powersets from 'data/powersets.js';
import origins from 'data/origins.js';

function Planner(props) {
  const [build, setBuild] = useState({
    name: '',
    archetype: 'Blaster',
    origin: origins[0].name,
    alignment: 'Hero',
    primary: powersets.Blaster.primaries[0],
    secondary: powersets.Blaster.secondaries[0],
  });

  // const [powersets, setPowersets] = useState({
  //   primary: { length: 0 },
  //   secondary: { length: 0 },
  // });

  console.log('BUILD: ', build);

  const updateBuild = (e) => {
    const { name, value } = e.target;
    if (name === 'archetype') {
      const { primaries, secondaries } = powersets[value];
      setBuild({
        ...build,
        [name]: value,
        primary: primaries[0],
        secondary: secondaries[0],
      });
    } else if (name === 'primary' || name === 'secondary') {
      const newPowerset = powersets[build.archetype][
        name === 'primary' ? 'primaries' : 'secondaries'
      ].find(({ displayName }) => displayName === value);
      setBuild({ ...build, [name]: newPowerset });
    } else {
      setBuild({ ...build, [name]: value });
    }
  };

  // const loadFile = () => {};

  return (
    <div>
      <SelectAT build={build} updateBuild={updateBuild} setBuild={setBuild} />
      <Powersets build={build} updateBuild={updateBuild} />
    </div>
  );
}

export default Planner;
