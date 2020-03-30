import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './components/Routes/';

// Context
import Providers from 'Providers/';

// Routing
import { Router } from 'react-router-dom';
import history from 'history.js';

// Styles
import './styles/index.scss';

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <Providers>
        <Routes />
      </Providers>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
