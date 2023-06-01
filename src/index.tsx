import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { TodoContextProvider } from './features/Todo/contexts/TodoProvider';
import { ProgressContextProvider } from './features/Todo/contexts/ProgressProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <TodoContextProvider>
    <ProgressContextProvider>
      <App />
    </ProgressContextProvider>
  </TodoContextProvider>
);

reportWebVitals();
