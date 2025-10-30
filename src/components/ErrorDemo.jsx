import { useState } from 'react';
import { LDObserve } from '@launchdarkly/observability';

function ErrorDemo() {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  // This will trigger the Error Boundary
  if (shouldThrowError) {
    throw new Error('This is a deliberate error to test the Error Boundary!');
  }

  const handleManualError = () => {
    try {
      // Simulate an error that we catch and report manually
      throw new Error('Manually caught error for demonstration');
    } catch (error) {
      // Manually record error to LaunchDarkly
      LDObserve.recordError(error, 'Manual error from button click', {
        component: 'ErrorDemo.jsx',
      });
      console.error('Manually recorded error:', error);
      alert('Manual error recorded! Check the console and LaunchDarkly dashboard.');
    }
  };

  const handleAsyncError = async () => {
    try {
      // Simulate an async operation that fails
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Async operation error for demonstration'));
        }, 1000);
      });
    } catch (error) {
      LDObserve.recordError(error, 'Async operation error', {
        component: 'ErrorDemo.jsx',
      });
      console.error('Async error recorded:', error);
      alert('Async error recorded! Check the console and LaunchDarkly dashboard.');
    }
  };

  const handleUncaughtError = () => {
    // This will be caught by the Error Boundary
    setShouldThrowError(true);
  };

  return (
    <div className="card">
      <h2>🐛 Error Tracking Demo</h2>
      <p>
        Test different types of error tracking. All errors are automatically sent to 
        LaunchDarkly Observability for analysis.
      </p>

      <div className="button-group">
        <button onClick={handleManualError}>
          Trigger Manual Error
        </button>
        
        <button onClick={handleAsyncError}>
          Trigger Async Error
        </button>
        
        <button 
          onClick={handleUncaughtError}
          style={{ backgroundColor: '#d9534f' }}
        >
          Trigger Uncaught Error (Error Boundary)
        </button>
      </div>

      <details style={{ marginTop: '20px', fontSize: '14px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#555', marginBottom: '10px' }}>
          View API Usage & Examples
        </summary>
        
        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <strong>API Usage:</strong>
          <pre style={{ 
            marginTop: '10px',
            padding: '12px',
            backgroundColor: '#fff',
            borderRadius: '4px',
            border: '1px solid #ddd',
            overflow: 'auto'
          }}>
{`LDObserve.recordError(error, 'Error description', {
  component: 'MyComponent.jsx',
});`}
          </pre>
          <p style={{ marginTop: '10px', color: '#666' }}>
            <strong>Parameters:</strong>
          </p>
          <ul style={{ marginLeft: '20px', color: '#666', lineHeight: '1.8' }}>
            <li><strong>error</strong> (Error): The error object to record</li>
            <li><strong>message</strong> (string): Descriptive message about the error context (optional)</li>
            <li><strong>attributes</strong> (object): Additional metadata (optional)</li>
          </ul>
        </div>

        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          fontSize: '14px',
          borderLeft: '4px solid #ff9800'
        }}>
          <strong>What's being tracked:</strong>
          <ul style={{ marginTop: '10px', marginLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>Manual Error:</strong> Caught error with custom context and metadata</li>
            <li><strong>Async Error:</strong> Error from asynchronous operations</li>
            <li><strong>Uncaught Error:</strong> Error caught by React Error Boundary</li>
          </ul>
        </div>
      </details>
    </div>
  );
}

export default ErrorDemo;

