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

import { closeMenu } from "js/closeTracker.js";

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <UniversalProviders>
        <div onClick={closeMenu} style={{ display: "flex" }}>
          <NavBar />
          <Routes />
        </div>
      </UniversalProviders>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
