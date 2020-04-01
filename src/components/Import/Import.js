import React, { useState, useContext } from 'react';

import { BuildContext } from 'Providers/Builds.js';

import styles from './styles.module.scss';

function Import(props) {
  const [userBuild, setUserBuild] = useState('');
  const { saveBuild } = useContext(BuildContext);

  const submitBuild = e => {
    e.preventDefault();

    saveBuild(userBuild);
  };
  return (
    <form className={styles.Import} onSubmit={e => submitBuild(e)}>
      <label>
        In your builder, go to <b>Import / Export > Long Forum Export</b>.
        Select "HTML Export" from the right menu then click "Export Now". Paste
        the results in the box below.
      </label>
      <textarea
        value={userBuild}
        onChange={e => setUserBuild(e.target.value)}
      />
      <button type="submit">Submit Build</button>
    </form>
  );
}

export default Import;
