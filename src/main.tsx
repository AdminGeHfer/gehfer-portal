import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

console.log('Starting application...');

const container = document.getElementById('root');
console.log('Root element found:', container);

if (container) {
  console.log('Creating root and rendering app...');
  createRoot(container).render(<App />);
} else {
  console.error('Root element not found!');
}

// Add error handling for script loading
window.addEventListener('error', (event) => {
  if (event.message === 'Failed to fetch') {
    console.error('Failed to load required scripts. Please check your internet connection and try again.');
  }
  console.error('Script loading error:', event);
});