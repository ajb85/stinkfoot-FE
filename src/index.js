import React from "react";
import ReactDOM from "react-dom";
import Routes from "./Routes/";

// Context
import UniversalProviders from "providers";

// Routing
import { Router } from "react-router-dom";
import history from "history.js";

// Styles
import "./styles/index.scss";

import { closeMenu } from "js/closeTracker.js";

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <UniversalProviders>
        <div onClick={closeMenu}>
          <Routes />
        </div>
      </UniversalProviders>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
