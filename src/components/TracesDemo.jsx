import { useState } from 'react';
import { LDObserve } from '@launchdarkly/observability';

function TracesDemo() {
  const [autoResult, setAutoResult] = useState(null);
  const [manualResult, setManualResult] = useState(null);
  const [manualProgress, setManualProgress] = useState('');

  const handleAutomaticSpan = async () => {
    setAutoResult('Processing...');
    
    // Automatic span - perfect for simple, contained operations
    // The span automatically ends when this callback completes
    LDObserve.startSpan('api.fetch.simple', async (span) => {
      span.setAttributes({
        'operation.type': 'simple_fetch',
        'timestamp': new Date().toISOString()
      });
      
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulated response data
      const simulatedData = {
        id: 1,
        title: 'Getting Started with LaunchDarkly Observability',
        userId: 1
      };
      
      span.setAttributes({
        'response.status': 200,
        'response.title': simulatedData.title
      });
      
      setAutoResult(`✓ Fetched: "${simulatedData.title}"`);
      // Span ends automatically here when callback completes
    });
  };

  const handleManualSpan = async () => {
    setManualResult('Processing...');
    setManualProgress('Step 1/3: Starting...');
    
    let completedSteps = 0;
    
    // Manual span - you control when the span ends by calling span.end()
    LDObserve.startManualSpan('workflow.multi_step', async (span) => {
      try {
        span.setAttributes({
          'operation.type': 'multi_step_workflow',
          'workflow.total_steps': 3
        });
        
        // Step 1: Simulate first operation
        setManualProgress('Step 1/3: Processing first operation...');
        await new Promise(resolve => setTimeout(resolve, 600));
        completedSteps = 1;
        span.setAttributes({
          'step.1.completed': true,
          'step.1.timestamp': new Date().toISOString()
        });
        
        // Step 2: Simulate second operation
        setManualProgress('Step 2/3: Processing second operation...');
        await new Promise(resolve => setTimeout(resolve, 600));
        completedSteps = 2;
        span.setAttributes({
          'step.2.completed': true,
          'step.2.timestamp': new Date().toISOString()
        });
        
        // Step 3: Simulate final operation
        setManualProgress('Step 3/3: Processing final operation...');
        await new Promise(resolve => setTimeout(resolve, 600));
        completedSteps = 3;
        span.setAttributes({
          'step.3.completed': true,
          'step.3.timestamp': new Date().toISOString(),
          'workflow.success': true
        });
        
        span.setStatus({ code: 'OK' });
        setManualResult(`✓ Completed ${completedSteps}/3 steps!`);
        setManualProgress('');
        
      } catch (error) {
        console.error('Manual span error:', error);
        span.setStatus({ code: 'ERROR', message: error.message });
        
        // Record error using the same pattern as ErrorDemo
        LDObserve.recordError(error, 'Multi-step workflow failed', {
          component: 'TracesDemo.jsx',
        });
        
        setManualResult(`✗ Error after ${completedSteps}/3 steps: ${error.message}`);
        setManualProgress('');
      } finally {
        // IMPORTANT: You must explicitly call span.end()
        span.end();
      }
    });
  };

  return (
    <div className="card">
      <h2>🔍 Distributed Traces Demo</h2>
      <p>
        Create trace spans to track operations. Compare automatic vs. manual span management
        with real examples.
      </p>

      {/* Automatic Span Example */}
      <div style={{ marginTop: '20px', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '10px', color: '#333' }}>
          Example 1: Automatic Span (startSpan)
        </h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          Best for simple, contained operations. The span automatically ends when the callback completes.
        </p>
        
        <button onClick={handleAutomaticSpan} style={{ backgroundColor: '#2196f3' }}>
          Run Simple API Fetch
        </button>
        
        {autoResult && (
          <div style={{
            marginTop: '15px',
            padding: '12px',
            backgroundColor: autoResult.startsWith('✓') ? '#e8f5e9' : '#fff3e0',
            borderRadius: '6px',
            borderLeft: `4px solid ${autoResult.startsWith('✓') ? '#4caf50' : '#ff9800'}`,
            fontSize: '14px'
          }}>
            {autoResult}
          </div>
        )}
        
        <details style={{ marginTop: '15px', fontSize: '14px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#555' }}>
            View Code
          </summary>
          <pre style={{ 
            marginTop: '10px',
            padding: '12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '13px'
          }}>
{`// Span ends automatically when callback completes
LDObserve.startSpan('api.fetch.simple', async (span) => {
  span.setAttributes({
    'operation.type': 'simple_fetch'
  });
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  span.setAttributes({
    'response.status': 200,
    'response.title': 'Data loaded successfully'
  });
  
  // Span ends here automatically
});`}
          </pre>
        </details>
      </div>

      <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ddd' }} />

      {/* Manual Span Example */}
      <div style={{ marginTop: '30px', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '10px', color: '#333' }}>
          Example 2: Manual Span (startManualSpan)
        </h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          For operations where you need explicit control over when the span ends. Unlike automatic spans,
          you must call <code>span.end()</code> yourself - perfect for complex workflows with multiple steps.
        </p>
        
        <button onClick={handleManualSpan} style={{ backgroundColor: '#9c27b0' }}>
          Run Multi-Step Workflow
        </button>
        
        {manualProgress && (
          <div style={{
            marginTop: '15px',
            padding: '12px',
            backgroundColor: '#e3f2fd',
            borderRadius: '6px',
            borderLeft: '4px solid #2196f3',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            ⏳ {manualProgress}
          </div>
        )}
        
        {manualResult && !manualProgress && (
          <div style={{
            marginTop: '15px',
            padding: '12px',
            backgroundColor: manualResult.startsWith('✓') ? '#e8f5e9' : '#ffebee',
            borderRadius: '6px',
            borderLeft: `4px solid ${manualResult.startsWith('✓') ? '#4caf50' : '#f44336'}`,
            fontSize: '14px'
          }}>
            {manualResult}
          </div>
        )}
        
        <details style={{ marginTop: '15px', fontSize: '14px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#555' }}>
            View Code
          </summary>
          <pre style={{ 
            marginTop: '10px',
            padding: '12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '13px'
          }}>
{`// Manual span - YOU must call span.end()
LDObserve.startManualSpan('workflow.multi_step', async (span) => {
  let completedSteps = 0;
  
  try {
    span.setAttributes({ 'workflow.total_steps': 3 });
    
    // Step 1
    await new Promise(resolve => setTimeout(resolve, 600));
    completedSteps = 1;
    span.setAttributes({ 'step.1.completed': true });
    
    // Step 2
    await new Promise(resolve => setTimeout(resolve, 600));
    completedSteps = 2;
    span.setAttributes({ 'step.2.completed': true });
    
    // Step 3
    await new Promise(resolve => setTimeout(resolve, 600));
    completedSteps = 3;
    span.setAttributes({ 'step.3.completed': true });
    
    span.setStatus({ code: 'OK' });
    // Result: Completed 3/3 steps!
  } catch (error) {
    span.setStatus({ code: 'ERROR' });
    
    // Record error (consistent with ErrorDemo)
    LDObserve.recordError(error, 'Workflow failed', {
      component: 'TracesDemo.jsx',
    });
  } finally {
    span.end(); // MUST call this!
  }
});`}
          </pre>
        </details>
      </div>

      {/* Key Differences */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <strong>🎯 Key Differences:</strong>
        
        <div style={{ marginTop: '15px' }}>
          <strong style={{ color: '#2196f3' }}>Automatic Span (startSpan):</strong>
          <ul style={{ marginTop: '8px', marginLeft: '20px', lineHeight: '1.8', color: '#666' }}>
            <li>Span lifecycle managed for you</li>
            <li>Ends automatically when callback completes</li>
            <li>Perfect for simple, self-contained operations</li>
            <li>Less code, harder to mess up</li>
          </ul>
        </div>

        <div style={{ marginTop: '15px' }}>
          <strong style={{ color: '#9c27b0' }}>Manual Span (startManualSpan):</strong>
          <ul style={{ marginTop: '8px', marginLeft: '20px', lineHeight: '1.8', color: '#666' }}>
            <li>You explicitly control when the span ends</li>
            <li>Must call <code>span.end()</code> in a finally block</li>
            <li>Perfect for tracking multiple steps within one span</li>
            <li>Use when you need to update span attributes throughout the operation</li>
          </ul>
        </div>
      </div>

      {/* API Reference */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        fontSize: '14px',
        borderLeft: '4px solid #2196f3'
      }}>
        <strong>💡 Span Methods:</strong>
        <ul style={{ marginTop: '10px', marginLeft: '20px', lineHeight: '1.8' }}>
          <li><code>span.setAttributes(obj)</code> - Add custom metadata to the span</li>
          <li><code>span.setStatus(&#123;code: 'OK'|'ERROR'&#125;)</code> - Mark span status</li>
          <li><code>span.recordException(error)</code> - Record an error within the span</li>
          <li><code>span.end()</code> - End the span (manual spans only)</li>
        </ul>
      </div>
    </div>
  );
}

export default TracesDemo;
