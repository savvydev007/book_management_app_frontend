// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide XHR requests from command log
const app = window.top;
if (app) {
  app.console.log = () => {};
}

// Hide fetch requests from command log
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  return response;
}; 