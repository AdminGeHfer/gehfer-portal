import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');

if (container) {
  console.log('Initializing application...');
  createRoot(container).render(<App />);
} else {
  console.error('Root element not found!');
}