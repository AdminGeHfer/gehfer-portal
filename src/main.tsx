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