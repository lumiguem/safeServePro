import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Build stamp to force fresh static asset hashes after redeploys.
(window as Window & { __SAFE_SERVE_BUILD__?: string }).__SAFE_SERVE_BUILD__ = '2026-02-16.2';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
