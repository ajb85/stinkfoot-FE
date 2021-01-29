import React from "react";
import { getImageForStat } from "js/getImage.js";

import { combineClasses } from "js/utility.js";

import styles from "./styles.module.scss";

const statKeyword = {
  Fire: "Damage",
  Cold: "Damage",
  Energy: "Damage",
  Smashing: "Damage",
  Lethal: "Damage",
  Negative: "Damage",
  Toxic: "Damage",
  Psionic: "Damage",
  Immob: "Status",
  Hold: "Status",
  Stun: "Status",
  Sleep: "Status",
  Terror: "Status",
  Confuse: "Status",
  "Run Speed": "Debuff",
  "Recharge Time": "Debuff",
  "Flight Speed": "Debuff",
};

export default function Thermometer({ steps, fillLine }) {
  return (
    <div className={styles.thermometer}>
      {steps.map(({ temperature, text }, i) => {
        const isLast = i === steps.length - 1;
        const isBulbFilled = fillLine >= i;

        return (
          <div key={text[0]} className={styles.step}>
            <p
              className={combineClasses(
                styles.temperature,
                isBulbFilled && styles.filled
              )}
            >
              {temperature}
            </p>
            {!isLast && (
              <div
                className={combineClasses(
                  styles.stem,
                  fillLine > i && styles.filled
                )}
              />
            )}
            <div className={combineClasses(styles.text)}>
              {text.map((t) => {
                if (!t.includes("Res(")) {
                  return <p key={t}>{t}</p>;
                }
                const firstSpace = t.indexOf(" ");
                const numbers = t.substring(0, firstSpace);
                const splitStats = t
                  .substring(t.indexOf("(") + 1, t.length - 1)
                  .split(", ");
                const keyword = statKeyword[splitStats[0]] || "";
                const stats = splitStats.map((s) => getImageForStat(s) || s);
                return (
                  <p key={t} style={{ position: "relative" }}>
                    {temperature > 5 && <div className={styles.lineThrough} />}
                    {numbers} {keyword} Res(
                    {stats.reduce((acc, cur, i) => {
                      if (cur.includes("data:image")) {
                        acc.push(
                          <img key={cur} src={cur} alt="Enhancement Icon" />
                        );
                      } else {
                        acc.push(cur);
                      }

                      return acc;
                    }, [])}
                    )
                  </p>
                );
              })}
            </div>
          </div>
        );
      })}

      <h3>Set Bonuses</h3>
    </div>
  );
}
