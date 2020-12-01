import React from "react";

import Dropdown from "components/Dropdown";
import OnScreenHover from "components/OnScreenHover/";

import useActiveSets from "providers/builder/useActiveSets.js";
import {
  useTogglePower,
  usePowerSelectionColor,
  useRemovePool,
} from "hooks/powersets.js";

import { getPowersetImage } from "helpers/getImages.js";

import styles from "./styles.module.scss";

function Powerset(props) {
  const { tracking, setActiveTracking } = useActiveSets();
  const { header, dropdown = {}, powerList, poolIndex, compact } = props;
  const tp = useTogglePower();

  const powerSelectionColor = usePowerSelectionColor();
  const isPoolPower = poolIndex !== undefined;
  const removePool = useRemovePool();

  // This allows components to supply their own methods to run when
  // clicking a power or changing dropdown selection.
  const togglePower = props.togglePower || tp;
  const updateBuild = props.onChange || setActiveTracking;
  const width = compact ? 123 : 170;

  const index = dropdown.name && tracking[dropdown.name];

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
      {dropdown.name && dropdown.list && (
        <div style={{ width }}>
          <Dropdown
            selected={index}
            name={dropdown.name}
            width={150 + 20}
            options={props.dropdown.list}
            onChange={updateBuild}
          />
        </div>
      )}
      <div
        style={{ width, textAlign: compact ? "center" : "left" }}
        className={styles.powersList}
      >
        {powerList.map((p) => {
          return (
            <div key={p.fullName} className={styles.power}>
              <p
                style={{ color: powerSelectionColor(p) }}
                onClick={togglePower.bind(this, p)}
              >
                {p.displayName}
              </p>
              <OnScreenHover className={styles.powerPreviewMenu}>
                <div>
                  <p>{p.displayName}</p>
                  <p>{p.description.short}</p>
                </div>
                <p>{p.description.long}</p>
              </OnScreenHover>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function createFilteredOptionsList(filterFunction, list) {
  return list
    .map((ps, i) => ({
      ...ps,
      value: i,
      display: ps.displayName,
      image: getPowersetImage(ps.imageName),
    }))
    .filter((powerset) => filterFunction(powerset)); // could be single .reduce
}

export default Powerset;
