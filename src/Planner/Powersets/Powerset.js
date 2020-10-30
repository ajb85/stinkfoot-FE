import React from "react";

import Dropdown from "components/Dropdown";
import useActiveSets from "providers/useActiveSets.js";
import { getPowersetImage } from "helpers/getImages.js";
import {
  useTogglePower,
  useCanPowersetBeAdded,
  usePowerSelectionColor,
} from "hooks/powersets.js";
import usePoolPowers from "providers/builder/usePoolPowers.js";

import styles from "./styles.module.scss";

function Powerset(props) {
  const { tracking, setActiveTracking } = useActiveSets();
  const { header, dropdown, powerList, poolIndex, compact } = props;
  const tp = useTogglePower();
  const canPowersetBeAdded = useCanPowersetBeAdded();
  const powerSelectionColor = usePowerSelectionColor();
  const isPoolPower = poolIndex !== undefined;
  const { removePool } = usePoolPowers();

  // This allows components to supply their own methods to run when
  // clicking a power or changing dropdown selection.
  const togglePower = props.togglePower || tp;
  const updateBuild = props.updateBuild || setActiveTracking;
  const width = compact ? 123 : 170;

  const { list, name } = dropdown;
  const index = tracking[name];

  return (
    <div className={styles.Powerset}>
      {header ? (
        isPoolPower ? (
          <h3 style={{ width }} onClick={removePool.bind(this, poolIndex)}>
            {header}
          </h3>
        ) : (
          <h3 style={{ width }}>{header}</h3>
        )
      ) : null}
      {dropdown && (
        <div style={{ width }}>
          <Dropdown
            selected={index}
            name={name}
            width={150 + 20}
            options={filterDropdownList(canPowersetBeAdded, list).map((p) => ({
              value: p.originalIndex,
              display: p.displayName,
              image: getPowersetImage(p.imageName),
            }))}
            onChange={updateBuild}
          />
        </div>
      )}
      <div
        style={{ width, textAlign: compact ? "center" : "left" }}
        className={styles.powersList}
      >
        {powerList.map((p, i) => {
          return (
            <p
              key={p.fullName}
              style={{ color: powerSelectionColor(p) }}
              onClick={togglePower.bind(this, p, i)}
            >
              {p.displayName}
            </p>
          );
        })}
      </div>
    </div>
  );
}

function filterDropdownList(canPoolBeAdded, list) {
  return list
    .map((l, i) => {
      l.originalIndex = i;
      return l;
    })
    .filter((pool) => canPoolBeAdded(pool));
}

export default Powerset;
