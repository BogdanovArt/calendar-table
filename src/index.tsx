import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const root = document.getElementById('root');

// Add this import:

// Wrap the rendering in a function:
const render = (Component: any) => {
  ReactDOM.render(
    // Wrap App inside AppContainer
    <AppContainer>
      <Component />
    </AppContainer>,
    root
  );
};

// Do this once
serviceWorker.register();

// Render once
render(App);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./App', () => {
    render(App);
  });
}
