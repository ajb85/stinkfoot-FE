import React, { useState } from "react";

import {
  Alert,
  Form,
  FormInput,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
} from "shards-react";

import useCharacters from "providers/useCharacters.js";

import history from "history.js";
// import parseBuildFromStr from "js/parseStringToBuild.js";
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
        {newCharacter ? (
          <NewCharacter toggle={props.toggle} />
        ) : (
          <ImportCharacter />
        )}
      </ModalBody>
    </Modal>
  );
}

function NewCharacter({ toggle }) {
  const [charName, setCharName] = useState("");
  const { characters, createNewCharacter } = useCharacters();
  const updateName = (e) => setCharName(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();
    if (charName.length && !characters[charName]) {
      createNewCharacter(charName);
      setCharName("");
      toggle();
      history.push("/planner");
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
          valid={!!charName.length && !characters[charName]}
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
  // const [input, setInput] = useState("");
  // const [error, setError] = useState("");

  // const handleChange = (e) => {
  //   const build = parseBuildFromStr(e.target.value);
  //   if (build.error) {
  //     setError(build.error);
  //   } else {
  //     setError("");
  //     setInput(e.target.value);
  //   }
  // };

  return (
    <h2>Feature coming soon</h2>
    // <div>
    //   <h2>To import a character from Mids or Pines, follow these steps:</h2>
    //   <ul>
    //     <li>Open Mids then your Character</li>
    //     <li>From the top of mids, select "Import/Export"</li>
    //     <li>From the dropdown, select "Long Forum Export..."</li>
    //     <li>
    //       On the right side under "Formatting Code Type" select "HTML Export"
    //     </li>
    //     <li>Click the "Export Now" button at the bottom</li>
    //     <li>Click "OK" on the prompt</li>
    //     <li>Verify the input below is selected then paste</li>
    //   </ul>
    //   <FormInput
    //     valid={!!input && !error}
    //     value={input}
    //     placeholder="Paste exported build here"
    //     onChange={handleChange}
    //   />
    //   {error && (
    //     <Alert className={styles.Alert} theme="danger">
    //       {error}
    //     </Alert>
    //   )}
    // </div>
  );
}
