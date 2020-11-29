import React, { useState, useCallback } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ButtonGroup,
} from "shards-react";

import styles from "./styles.module.scss";

import notifications from "js/inspectVersions.js";
console.log("N: ", notifications);
export default function Notifications() {
  const [modal, setModal] = useState({
    isOpen: !!notifications.length,
    nIndex: 0,
  });

  const closeModal = useCallback(
    () => setModal({ isOpen: false, nIndex: 0 }),
    []
  );

  const nextButton = useCallback(
    () =>
      setModal({
        isOpen: modal.nIndex !== notifications.length - 1,
        nIndex: modal.nIndex + 1,
      }),
    [modal.nIndex]
  );

  const goBack = useCallback(
    () => setModal({ isOpen: true, nIndex: modal.nIndex - 1 }),
    [modal.nIndex]
  );

  if (!modal.isOpen) {
    return null;
  }

  const notification = notifications[modal.nIndex];

  return (
    <Modal
      open={modal.isOpen}
      toggle={closeModal}
      className={styles.Notifications}
    >
      <ModalHeader>Patch Notes v{notification.version}</ModalHeader>
      <ModalBody>
        <ul>
          {notification.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
          {notification.clearStorage && (
            <li className={styles.deletedData}>Deletes your data.</li>
          )}
        </ul>
      </ModalBody>
      <ButtonGroup className={styles.buttons}>
        <Button theme="light" onClick={goBack} disabled={!modal.nIndex}>
          Go Back
        </Button>
        <Button theme="primary" onClick={nextButton}>
          {modal.nIndex !== notifications.length - 1 ? "Next" : "Finish"}
        </Button>
      </ButtonGroup>
    </Modal>
  );
}
