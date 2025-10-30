import React from 'react'
import ReactDOM from 'react-dom/client'
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk'
// Observability plugin class for SDK initialization
import Observability from '@launchdarkly/observability'
// Session replay plugin class for SDK initialization  
import SessionReplay from '@launchdarkly/session-replay'
import App from './App.jsx'
import './index.css'

/**
 * LaunchDarkly Observability Demo - Main Entry Point
 * 
 * This application demonstrates how to integrate LaunchDarkly's observability
 * features with a React application. We use asyncWithLDProvider() to initialize
 * the SDK asynchronously with plugins before rendering the app.
 * 
 * Note: The standard React pattern is withLDProvider(), but asyncWithLDProvider()
 * gives us better control over the initialization flow and error handling.
 */

(async () => {
  try {
    const clientSideID = import.meta.env.VITE_LD_CLIENT_SIDE_ID;
    
    if (!clientSideID) {
      throw new Error('LaunchDarkly client-side ID not found in environment variables. Please set VITE_LD_CLIENT_SIDE_ID in your .env file.');
    }

    const LDProvider = await asyncWithLDProvider({
      clientSideID,
      // LaunchDarkly context (identifies the user/entity)
      // Randomized here for demo purposes. In reality, should be derived from your identity system for consistency.
      context: {
        kind: 'user',
        key: 'user-' + Math.random().toString(36).substr(2, 9),
        name: 'Demo User',
        email: 'demo@example.com'
      },
      options: {
        plugins: [
          /**
           * Observability Plugin Configuration
           * Provides error tracking, logging, metrics, and distributed tracing
           */
          new Observability({
            // tracingOrigins: Configures distributed tracing headers
            // - true: Traces ALL outgoing requests
            // - ['https://api.example.com']: Traces specific domains (RECOMMENDED for production)
            // - [/regex/]: Use regex patterns for flexible matching
            tracingOrigins: true,
            
            // networkRecording: Captures network requests for analysis
            networkRecording: {
              enabled: true,
              recordHeadersAndBody: true // Includes request/response headers and bodies
            }
            
            // Optional: Start manually after user consent
            // manualStart: true,
            // Then later: LDObserve.start()
          }),
          
          /**
           * Session Replay Plugin Configuration
           * Records user sessions for replay and analysis
           */
          new SessionReplay({
            // privacySetting options:
            // - 'none': Records everything (use for demos/internal tools)
            // - 'default': Redacts text matching PII patterns (RECOMMENDED for most apps)
            // - 'strict': Redacts all text and images (for sensitive applications)
            privacySetting: 'none'
            
            // Optional: Start manually after user consent
            // manualStart: true,
            // Then later: LDRecord.start({ forceNew: true })
          })
        ]
      }
    });

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <LDProvider>
          <App />
        </LDProvider>
      </React.StrictMode>,
    );
  } catch (err) {
    console.error('Failed to initialize LaunchDarkly:', err);
    
    // Render error message if initialization fails
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1>Initialization Error</h1>
          <p style={{ marginTop: '10px' }}>{err.message}</p>
        </div>
      </React.StrictMode>,
    );
  }
})();

