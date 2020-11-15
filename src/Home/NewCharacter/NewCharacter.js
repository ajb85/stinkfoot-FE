import React, { useState } from "react";
import styled from "styled-components";
import {
  Alert,
  Form,
  FormInput,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
} from "shards-react";

// import Input from "components/Input/";
// import Button from "components/Button/";

import useCharacters from "providers/useCharacters.js";

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
  const { characters, createNewCharacter } = useCharacters();
  const updateName = (e) => setCharName(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();
    if (charName.length && !characters[charName]) {
      createNewCharacter(charName);
      setCharName("");
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <h2>
        Create a new character from scratch within the app. If you'd like to
        import a character from Mids or Pines, use the Import button at the top.
      </h2>
      <div className={styles.newCharacterInput}>
        <FormInput
          valid={charName.length && !characters[charName]}
          inline
          value={charName}
          onChange={updateName}
          placeholder="Character Name"
        />
        <Button
          disabled={!charName.length || characters[charName]}
          type="submit"
        >
          Create
        </Button>
      </div>
      {characters[charName] && (
        <Alert className={styles.Alert} theme="danger">
          You already have a character with that name.
        </Alert>
      )}
    </Form>
  );
}

function ImportCharacter() {
  return <div>Import Character</div>;
}

const MenuItem = styled.span`
  background-color: ${({ active }) => (active ? "darkgrey " : "grey")};
`;
