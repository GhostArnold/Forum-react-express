import React from 'react';
import ReactDOM from 'react-dom/client';
// Для redux
import { store } from './redux/store';
import { Provider } from 'react-redux';
// Сброс базовых стилей
import 'normalize.css';
import App from './App/App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);
