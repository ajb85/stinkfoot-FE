import React from "react";
import ReactDOM from "react-dom";
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

import NavBar from "Home/NavBar/";
import AddCharacter from "Home/AddCharacter/";

import { closeMenu } from "js/closeTracker.js";

function App() {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <React.StrictMode>
      <Router history={history}>
        <UniversalProviders>
          <div onClick={closeMenu}>
            <AddCharacter
              open={modalOpen}
              toggle={setModalOpen.bind(this, !modalOpen)}
            />
            <NavBar openNewCharacterModal={setModalOpen.bind(this, true)} />
            <Routes />
          </div>
        </UniversalProviders>
      </Router>
    </React.StrictMode>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
