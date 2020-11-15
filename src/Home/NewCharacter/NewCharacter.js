import React, { useState } from "react";
import styled from "styled-components";
import { Form, Button, Modal, ModalBody, ModalHeader } from "shards-react";

import Input from "components/Input/";
// import Button from "components/Button/";

import styles from "./styles.module.scss";

export default function AddCharacter(props) {
  const [newCharacter, setNewCharacter] = useState(true);
  return (
    <Modal
      open={props.open}
      toggle={props.toggle}
      className={styles.menuSelect}
    >
      <ModalHeader>
        <Button
          theme={newCharacter ? "success" : "light"}
          onClick={setNewCharacter.bind(this, true)}
        >
          Create
        </Button>
        <Button
          theme={newCharacter ? "light" : "success"}
          onClick={setNewCharacter.bind(this, false)}
        >
          Import
        </Button>
      </ModalHeader>
      <ModalBody>
        {newCharacter ? <NewCharacter /> : <ImportCharacter />}
      </ModalBody>
    </Modal>
  );
}

function NewCharacter() {
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

function ImportCharacter() {
  return <div>Import Character</div>;
}

const MenuItem = styled.span`
  background-color: ${({ active }) => (active ? "darkgrey " : "grey")};
`;
