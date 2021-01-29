import React from "react";

import Thermometer from "components/Thermometer/";
import { combineClasses } from "js/utility.js";

import styles from "../styles.module.scss";

const steps = [
  {
    temperature: 6,
    text: [
      "2.25% Res(Fire, Cold)",
      "3.75% Res(Immob, Hold, Stun, Sleep, Terror, Confuse)",
    ],
  },
  {
    temperature: 2,
    text: ["10% Res(Run Speed, Recharge Time, Flight Speed)"],
  },
  {
    temperature: 1,
    text: ["2% End Recovery"],
  },
  {
    temperature: 4,
    text: ["1.88% Defense(Energy, Negative)", "0.94% Defense(Ranged)"],
  },
  {
    temperature: 5,
    text: ["3.75% Defense(Fire, Cold)", "1.88% Defense(AoE)"],
  },
];
export default function SetBonuses(props) {
  if (props.disabled) {
    return (
      <div className={combineClasses(styles.setBonuses, styles.disabled)} />
    );
  }
  return (
    <div className={styles.setBonuses}>
      <h3>Armageddon, level 50</h3>
      <Thermometer steps={steps} fillLine={1} />
      <div className={styles.procInfo}>
        <h4>Proc:</h4>
        <p>Deal 50 damage on hit</p>
      </div>
    </div>
  );
}
