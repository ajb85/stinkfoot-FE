import React, { useState } from 'react';

import styles from './styles.module.scss';

function Import(props) {
  const [build, setBuild] = useState('');
  return (
    <form className={styles.Import}>
      <label>
        Import Build from <b>Import / Export > Short Forum Post</b>. Select
        "HTML Export" from the right menu then click "Export Now". Paste the
        results in the box below.
      </label>
      <textarea value={build} onChange={e => setBuild(e.target.value)} />
      <button type="submit">Submit Build</button>
    </form>
  );
}

export default Import;
