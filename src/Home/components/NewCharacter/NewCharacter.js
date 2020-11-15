import React, { useState } from "react";
import { Form } from "shards-react";

import Input from "components/Input/";
import Button from "components/Button/";

// import styles from "./styles.module.scss";

export default function NewCharacter(props) {
  const [charName, setCharName] = useState("");
  const updateName = (e) => setCharName(e.target.value);

  const onSubmit = (e) => e.preventDefault();
  return (
    <Form onSubmit={onSubmit}>
      <Input
        value={charName}
        onChange={updateName}
        placeholder="Character Name"
      />
      <Button submit>+</Button>
    </Form>
  );
}
