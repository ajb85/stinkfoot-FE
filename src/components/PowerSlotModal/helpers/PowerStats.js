import React from "react";

import { stopProp } from "js/utility.js";

import styles from "../styles.module.scss";

export default function PowerStats(props) {
  return (
    <div className={styles.PowerStats} onClick={stopProp}>
      <h2>Power Totals</h2>
      <div className={styles.comingSoon}>
        <h3>
          COMING
          <br />
          SOON
        </h3>
      </div>
      <table>
        <thead>
          <tr>
            <th colSpan="4">Original Stats</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Acc</td>
            <td>Dmg</td>
            <td>End</td>
            <td>Rech</td>
          </tr>
          <tr>
            <td>1.22</td>
            <td>56.43</td>
            <td>20.33</td>
            <td>3.56s</td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th colSpan="4">Enhanced Stats</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Acc</td>
            <td>Dmg</td>
            <td>End</td>
            <td>Rech</td>
          </tr>
          <tr>
            <td>1.22</td>
            <td>56.43</td>
            <td>20.33</td>
            <td>3.56s</td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th colSpan="4">Enhancement Totals</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Acc</td>
            <td>Dmg</td>
            <td>End</td>
            <td>Rech</td>
          </tr>
          <tr>
            <td>68.8%</td>
            <td>68.8%</td>
            <td>68.8%</td>
            <td>68.8%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
