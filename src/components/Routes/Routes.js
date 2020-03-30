import React, { useContext } from 'react';
// import { Route } from 'react-router-dom';
import Import from 'components/Import/';
import BuildList from 'components/BuildList/';

import { BuildContext } from 'Providers/Builds.js';

function Routes(props) {
  const { build } = useContext(BuildContext);
  return <>{Object.keys(build).length ? <BuildList /> : <Import />}</>;
}

export default Routes;
