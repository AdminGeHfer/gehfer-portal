import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Enhanced logging
console.log('Starting application...');

// Get root element
const container = document.getElementById('root');
console.log('Root element found:', container);

if (container) {
  console.log('Creating root and rendering app...');
  createRoot(container).render(<App />);
} else {
  console.error('Root element not found!');
}

// Enhanced error handling for script loading
window.addEventListener('error', (event) => {
  console.error('Script loading error:', event);
  
  // Specific handling for fetch errors
  if (event.message === 'Failed to fetch') {
    console.error('Failed to load required scripts. Please check your internet connection and try again.');
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event);
});