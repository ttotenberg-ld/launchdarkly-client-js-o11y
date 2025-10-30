# Contributing to LaunchDarkly Observability Demo

Thank you for your interest in contributing to this demo application! This guide will help you get started with development and testing.

## Setting Up Development Environment

### Prerequisites

- Node.js 16+ and npm
- A LaunchDarkly account with access to observability features
- Git for version control

### Installation Steps

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/launchdarkly-client-js-o11y.git
   cd launchdarkly-client-js-o11y
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Add your LaunchDarkly client-side ID to `.env`**
   ```
   VITE_LD_CLIENT_SIDE_ID=your-client-side-id-here
   ```
   
   Find your client-side ID in: **LaunchDarkly Dashboard > Project Settings > Environments**

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## Development Guidelines

### Code Style

- Use functional components with React Hooks
- Follow existing code formatting and structure
- Add meaningful comments for complex logic
- Use descriptive variable and function names

### Component Structure

When creating new demo components:

```javascript
import { useState } from 'react';
import { LDObserve } from '@launchdarkly/observability';

/**
 * ComponentName - Brief description
 * 
 * Demonstrates:
 * - Feature 1
 * - Feature 2
 */
function ComponentName() {
  // Component implementation
  
  return (
    <div className="card">
      <h2>🎯 Component Title</h2>
      <p>Brief description of what this component demonstrates</p>
      
      {/* Demo implementation */}
      
      {/* Information box */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <strong>What's being demonstrated:</strong>
        <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
          <li>Key point 1</li>
          <li>Key point 2</li>
        </ul>
      </div>
    </div>
  );
}

export default ComponentName;
```

### Adding New Features

1. **Create a new component** in `src/components/`
2. **Import and use observability APIs** (`LDObserve`, `LDRecord`)
3. **Add component to `DashboardLayout.jsx`**
4. **Update `README.md`** to document the new feature
5. **Test thoroughly** with different scenarios

## Testing Changes

Before submitting changes, please test:

### 1. Basic Functionality
- [ ] Application starts without errors
- [ ] All demo components render correctly
- [ ] Buttons and interactions work as expected

### 2. Observability Features
- [ ] Errors are recorded in LaunchDarkly dashboard
- [ ] Network requests are captured
- [ ] Metrics are sent correctly
- [ ] Session replay works
- [ ] Distributed tracing headers are added

### 3. Privacy Settings
Test with different privacy settings:
- [ ] `privacySetting: 'none'` - Everything recorded
- [ ] `privacySetting: 'default'` - PII redacted
- [ ] `privacySetting: 'strict'` - All text redacted

### 4. Browser Compatibility
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

### 5. Console Errors
- [ ] Check browser console for errors
- [ ] Verify no CSP violations
- [ ] Confirm SDK initializes successfully

## Testing with Your Own LaunchDarkly Environment

1. **Create a test environment** in LaunchDarkly
2. **Update `.env`** with your client-side ID
3. **Create the `releaseFancyWidget` flag** (boolean) in your environment
4. **Run the application** and verify:
   - SDK connects successfully
   - Observability data appears in dashboard
   - Session replays are recorded
   - Feature flag works (toggle on/off)

## Common Issues and Solutions

### Issue: SDK Initialization Fails

**Symptoms**: Error message on screen, no data in LaunchDarkly

**Solutions**:
- Verify `VITE_LD_CLIENT_SIDE_ID` is set correctly in `.env`
- Ensure you're using a **client-side ID**, not a server-side SDK key
- Check network tab for connection errors
- Verify your LaunchDarkly account has observability features enabled

### Issue: CSP Violations in Console

**Symptoms**: Browser blocks requests, observability data not sent

**Solutions**:
- Check `index.html` has correct CSP meta tag
- Verify all required domains are in CSP `connect-src`
- For production, set CSP via HTTP headers

### Issue: Session Replay Not Working

**Symptoms**: No replays appear in LaunchDarkly dashboard

**Solutions**:
- Verify `SessionReplay` plugin is initialized
- Check browser console for errors
- Ensure CSP allows `worker-src data: blob:`
- Wait a few minutes for data to process

### Issue: Network Requests Not Recorded

**Symptoms**: API calls work but don't appear in observability

**Solutions**:
- Verify `networkRecording.enabled: true`
- Check that requests use `fetch` or `XMLHttpRequest`
- Ensure CSP allows connections to observability endpoints

## Submitting Changes

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow code style guidelines
   - Add/update documentation
   - Test thoroughly

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: Brief description of changes"
   ```
   
   Use conventional commit prefixes:
   - `Add:` - New features or components
   - `Fix:` - Bug fixes
   - `Update:` - Changes to existing features
   - `Docs:` - Documentation updates

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Include screenshots if UI changed
   - List what you tested

### PR Checklist

- [ ] Code follows existing style and conventions
- [ ] All new features are documented in README
- [ ] Components include helpful comments
- [ ] Tested with multiple browsers
- [ ] Verified observability data reaches LaunchDarkly
- [ ] No console errors or warnings
- [ ] `.env` file not committed (in `.gitignore`)

## Questions or Need Help?

- **LaunchDarkly Docs**: https://launchdarkly.com/docs/sdk/observability/react-web
- **SDK API Reference**: https://launchdarkly.github.io/observability-sdk/
- **LaunchDarkly Support**: https://support.launchdarkly.com/
- **Community**: https://launchdarkly.com/community/

## Code of Conduct

This is a sample/demo application. Please be respectful and constructive in all interactions.

## License

This demo application is provided as-is for educational purposes.

