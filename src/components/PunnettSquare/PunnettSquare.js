import React from "react";
import styled from "styled-components";

import styles from "./styles.module.scss";

export default function PunnettSquare(props) {
  return (
    <div className={styles.selectEnhancements}>
      <div className={styles.EnhSectionSelect}>
        {props.topOptions.map((o) => {
          return (
            <p key={o.content} onClick={o.onClick} style={o.styles || {}}>
              {o.content}
            </p>
          );
        })}
      </div>
      <GridAndLabel labelDirection={props.labelDirection}>
        {props.children}
        <div className={styles.EnhPreviewSubSectionPreview}>
          {props.sideOptions.map((o) => {
            return (
              <p key={o.content} onClick={o.onClick} style={o.style}>
                {o.content}
              </p>
            );
          })}
        </div>
      </GridAndLabel>
    </div>
  );
}

const GridAndLabel = styled.div`
  display: flex;
  flex-direction: ${({ labelDirection }) =>
    labelDirection === "left" ? "row-reverse" : "row"};
`;
