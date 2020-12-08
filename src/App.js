import React from "react";
import Routes from "./Routes/";

// Context
import UniversalProviders from "providers/";

// Routing
import { Router } from "react-router-dom";
import history from "history.js";

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "./styles/index.scss";
import styles from "styles.module.scss";

import NavBar from "Home/NavBar/";
import AddCharacter from "Home/AddCharacter/";
import Notifications from "Home/Notifications/";

import { closeMenu } from "js/closeTracker.js";

export default function App() {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    // <React.StrictMode>
    <Router history={history}>
      <UniversalProviders>
        <div onClick={closeMenu} className={styles.appContainer}>
          <Notifications />
          <AddCharacter
            open={modalOpen}
            toggle={setModalOpen.bind(this, !modalOpen)}
          />
          <NavBar openNewCharacterModal={setModalOpen.bind(this, true)} />
          <div className={styles.routeContainer}>
            <Routes />
          </div>
        </div>
      </UniversalProviders>
    </Router>
    // </React.StrictMode>
  );
}
