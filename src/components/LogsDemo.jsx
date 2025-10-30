import { LDObserve } from '@launchdarkly/observability';

function LogsDemo() {
  const handleDebugLog = () => {
    LDObserve.recordLog('Debug log message', 'debug');
    console.log('Debug log sent to LaunchDarkly');
  };

  const handleInfoLog = () => {
    LDObserve.recordLog('Info log message', 'info');
    console.log('Info log sent to LaunchDarkly');
  };

  const handleWarnLog = () => {
    LDObserve.recordLog('Warning log message', 'warn');
    console.log('Warning log sent to LaunchDarkly');
  };

  const handleErrorLog = () => {
    LDObserve.recordLog('Error log message', 'error');
    console.log('Error log sent to LaunchDarkly');
  };

  return (
    <div className="card">
      <h2>📝 Custom Logs Demo</h2>
      <p>
        Send custom log messages to LaunchDarkly at different severity levels.
        All logs are captured and viewable in the LaunchDarkly dashboard.
      </p>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>Log Severity Levels</h3>
        <div className="button-group">
          <button 
            onClick={handleDebugLog}
            style={{ backgroundColor: '#9e9e9e' }}
          >
            Send Debug Log
          </button>
          
          <button 
            onClick={handleInfoLog}
            style={{ backgroundColor: '#2196f3' }}
          >
            Send Info Log
          </button>
          
          <button 
            onClick={handleWarnLog}
            style={{ backgroundColor: '#ff9800' }}
          >
            Send Warning Log
          </button>
          
          <button 
            onClick={handleErrorLog}
            style={{ backgroundColor: '#d9534f' }}
          >
            Send Error Log
          </button>
        </div>
      </div>

      <div style={{ 
        marginTop: '20px', 
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
{`LDObserve.recordLog('Example log message', Severity.DEBUG);`}
        </pre>
        <p style={{ marginTop: '10px', color: '#666' }}>
          <strong>Parameters:</strong>
        </p>
        <ul style={{ marginLeft: '20px', color: '#666', lineHeight: '1.8' }}>
          <li><strong>message</strong> (string): The log message to record</li>
          <li><strong>severity</strong>: Log level - 'debug', 'info', 'warn', or 'error'</li>
        </ul>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        fontSize: '14px',
        borderLeft: '4px solid #2196f3'
      }}>
        <strong>💡 When to use each severity level:</strong>
        <ul style={{ marginTop: '10px', marginLeft: '20px', lineHeight: '1.8' }}>
          <li><strong>debug:</strong> Detailed diagnostic information for troubleshooting</li>
          <li><strong>info:</strong> General informational messages about application flow</li>
          <li><strong>warn:</strong> Warning messages for potentially harmful situations</li>
          <li><strong>error:</strong> Error events that might still allow the application to continue</li>
        </ul>
      </div>
    </div>
  );
}

export default LogsDemo;

