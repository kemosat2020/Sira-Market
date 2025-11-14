
import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Changed import to explicitly include file extension to ensure module resolution.
import App from './App.tsx';
import { LanguageProvider } from './i18n/index.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);