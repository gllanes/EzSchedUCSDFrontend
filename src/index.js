import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


// Setup mock server if this is a development environment
if (process.env.NODE_ENV === 'development'
    || process.env.NODE_ENV === 'test') {
  // FIXME: can't resolve fs error.
  // require('dotenv').config();
  const { worker } = require('./mocks/browser')
  worker.start()
}


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
