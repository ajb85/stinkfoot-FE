import React from 'react';
import ReactDOM from 'react-dom';
import Import from './components/Import/';

// Routing
import { Router } from 'react-router-dom';
import history from 'history.js';

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <Import />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
