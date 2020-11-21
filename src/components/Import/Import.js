import React, { useState, useEffect, useRef } from "react";

import useBuild from "Providers/Builds.js";

import styles from "./styles.module.scss";

function Import(props) {
  const inputREF = useRef(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const { saveBuild, isValidBuild } = useBuild();

  useEffect(() => {
    if (inputREF.current) {
      inputREF.current.focus();
    }
  }, [inputREF]);

  const submitBuild = (e) => {
    e.preventDefault();
    setWasSubmitted(true);

    if (isValidBuild(e.target.value)) {
      saveBuild(e.target.value);
    }
  };
  return (
    <form className={styles.Import}>
      <label>
        In your builder, go to <b>Import / Export > Long Forum Export</b>.
        Select "HTML Export" from the right menu then click "Export Now". Paste
        the results in the box below.
      </label>
      <input
        ref={inputREF}
        onChange={(e) => submitBuild(e)}
        // style={{ display: 'none' }}
      />
      {wasSubmitted && (
        <div className={styles.errorText}>
          <p>
            Hmm, that's not a build format I understand. Be sure to follow these
            steps:
          </p>
          <ul>
            <li>Open your Mids or Pines hero planner</li>
            <li>Ensure you have IO Sets equipped on your build</li>
            <li>Click "Import/Export" at the top</li>
            <li>Click "Long Forum Export..."</li>
            <li>
              In the menu that opens, select "HTML Export" from the right side
            </li>
            <li>Click the "Export Now" button at the bottom</li>
            <li>Paste those results into the input above</li>
          </ul>
        </div>
      )}
    </form>
  );
}

export default Import;
