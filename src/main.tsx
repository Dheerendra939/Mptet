import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent "Converting circular structure to JSON" errors in iframe sandbox environments.
// We sanitize complex/circular arguments in console logs/errors.
const safeSanitize = (val: any, seen = new WeakSet()): any => {
  if (val === null || val === undefined) return val;
  if (typeof val !== 'object') return val;
  if (val instanceof Error) {
    return { name: val.name, message: val.message, stack: val.stack };
  }
  if (val instanceof Date) return val.toISOString();
  if (val instanceof RegExp) return val.toString();
  
  if (seen.has(val)) return '[Circular]';
  seen.add(val);

  // Exclude Firebase internal instances with minified constructors Y2, Ka, etc.
  if (val.constructor) {
    const cName = val.constructor.name;
    if (cName === 'Y2' || cName === 'Ka' || cName === 'Firestore' || cName === 'FirebaseApp' || cName === 'FirebaseAuth' || cName === 'AuthImpl' || cName === 'DocumentReference' || cName === 'Query' || cName === 'CollectionReference') {
      return `[Firebase/Firestore Object: ${cName}]`;
    }
  }

  if (Array.isArray(val)) {
    return val.map(item => safeSanitize(item, seen));
  }

  const result: any = {};
  for (const key in val) {
    if (Object.prototype.hasOwnProperty.call(val, key)) {
      try {
        result[key] = safeSanitize(val[key], seen);
      } catch (e) {
        result[key] = '[Unserializable]';
      }
    }
  }
  return result;
};

const patchConsole = (method: 'log' | 'warn' | 'error' | 'info') => {
  const original = console[method];
  if (original) {
    console[method] = function (...args: any[]) {
      const sanitized = args.map(arg => {
        try {
          return safeSanitize(arg);
        } catch (e) {
          return '[Unserializable Object]';
        }
      });
      original.apply(this, sanitized);
    };
  }
};

['log', 'warn', 'error', 'info'].forEach((m) => patchConsole(m as any));

// Intercept promise rejections to prevent unhandled circular error bubbles
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason) {
    try {
      const reason = event.reason;
      if (reason && typeof reason === 'object') {
        const msg = reason.message || String(reason);
        console.error('Unhandled Promise Rejection:', msg);
        event.preventDefault();
      }
    } catch (e) {}
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
