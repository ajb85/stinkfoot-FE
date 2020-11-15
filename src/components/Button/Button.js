import React from "react";
import { Button } from "shards-react";

import styles from "./styles.module.scss";

export default function CustomButton(props) {
  return (
    <Button className={styles.Button} size="sm" square outline>
      {props.children}
    </Button>
  );
}
