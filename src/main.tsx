import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { loader } from '@monaco-editor/react';
import App from './App.tsx';
import './index.css';

// Configure Monaco Editor to use CDN
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);