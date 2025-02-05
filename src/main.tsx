// src/main.tsx
import * as React from "react";
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { initializeSupabase } from '@/integrations/supabase/client';

const container = document.getElementById('root');

if (container) {
  console.log('Starting application initialization...');
  
  // Initialize Supabase first
  initializeSupabase().then((initialized) => {
    if (initialized) {
      console.log('Rendering React application...');
      createRoot(container).render(<App />);
    } else {
      console.error('Failed to initialize application');
      // Optionally render an error state
      container.innerHTML = '<div>Failed to initialize application. Please try again.</div>';
    }
  }).catch((error) => {
    console.error('Critical initialization error:', error);
    container.innerHTML = '<div>Critical initialization error. Please try again.</div>';
  });
} else {
  console.error('Root element not found!');
}
