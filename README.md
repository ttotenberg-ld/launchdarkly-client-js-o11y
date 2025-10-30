# LaunchDarkly Observability Demo - React Application

A comprehensive demonstration of LaunchDarkly's client-side JavaScript observability features, including error tracking, session replay, network recording, and distributed tracing.

## Features

This demo application showcases all major observability capabilities:

### 🐛 Error Tracking
- **Error Boundary Integration**: Automatic capture of uncaught React errors
- **Manual Error Recording**: Programmatic error reporting with custom context
- **Async Error Handling**: Tracking of errors in asynchronous operations
- All errors are automatically sent to LaunchDarkly with detailed context

### 🎬 Session Replay
- **Full Session Recording**: Captures all user interactions and UI changes
- **Privacy Controls**: Configurable privacy settings (none, default, strict)
- **Replay in LaunchDarkly**: Review user sessions directly in the LaunchDarkly dashboard

### 🌐 Network Recording
- **HTTP Request Tracking**: Monitors all fetch/XHR requests
- **Headers & Body Capture**: Records request/response headers and bodies
- **Performance Metrics**: Tracks request duration and status codes
- **Failed Request Logging**: Captures and reports failed network calls

### 🔍 Distributed Tracing
- **Frontend-Backend Attribution**: Links frontend requests to backend services
- **Tracing Origins**: Automatically adds tracing headers to outbound requests
- **End-to-End Visibility**: Full request flow visibility across systems

## Prerequisites

- Node.js 16+ and npm
- A LaunchDarkly account with access to observability features

## Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit the `.env` file and add your LaunchDarkly client-side ID:
   - Find your client-side ID in LaunchDarkly: **Project Settings > Environments**
   - Or use the demo environment: `609ead905193530d7c28647b`

```
VITE_LD_CLIENT_SIDE_ID=your-client-side-id-here
```

**Note**: Client-side IDs are not secret and are safe to include in client-side applications. Do not use server-side SDK keys in client-side code.

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will open at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.jsx      # React Error Boundary with LD integration
│   │   ├── DashboardLayout.jsx    # Main layout component
│   │   ├── ErrorDemo.jsx          # Error tracking demonstrations
│   │   ├── NetworkDemo.jsx        # Network recording demonstrations
│   │   ├── MetricsDemo.jsx        # Custom metrics demonstrations
│   │   ├── InteractionDemo.jsx    # Session replay & tracing demonstrations
│   │   └── FancyWidget.jsx        # Feature flag demo component
│   ├── App.jsx                    # Root app component
│   ├── main.jsx                   # Application entry point with LD initialization
│   └── index.css                  # Global styles
├── index.html                     # HTML template with CSP headers
├── vite.config.js                 # Vite configuration
├── package.json                   # Dependencies and scripts
├── .env.example                   # Environment variables template
└── .env                           # Environment variables (gitignored)
```

## Key Implementation Details

### LaunchDarkly Initialization

The app initializes LaunchDarkly with both observability plugins in `src/App.jsx`:

```javascript
const LDProviderComponent = await asyncWithLDProvider({
  clientSideID,
  context,
  options: {
    plugins: [
      new Observability({
        tracingOrigins: true,
        networkRecording: {
          enabled: true,
          recordHeadersAndBody: true
        }
      }),
      new SessionReplay({
        privacySetting: 'none'
      })
    ]
  }
});
```

### Error Boundary

The `ErrorBoundary` component catches React errors and forwards them to LaunchDarkly:

```javascript
componentDidCatch(error, errorInfo) {
  LDObserve.recordError(
    error,
    'React Error Boundary',
    { componentStack: errorInfo.componentStack }
  );
}
```

### Content Security Policy

The `index.html` includes required CSP headers for LaunchDarkly observability:

```html
<meta 
  http-equiv="Content-Security-Policy" 
  content="connect-src 'self' https://pub.observability.app.launchdarkly.com https://otel.observability.app.launchdarkly.com https://clientstream.launchdarkly.com https://events.launchdarkly.com; worker-src data: blob:;" 
/>
```

## Using the Demo

### 1. Error Tracking Demo
- **Manual Error**: Click to trigger a caught error that's manually reported
- **Async Error**: Triggers an error in an async operation
- **Uncaught Error**: Causes a React error that's caught by the Error Boundary

### 2. Network Recording Demo
- **GET Request**: Makes a simple GET request
- **POST Request**: Sends a POST request with body data
- **Failed Request**: Deliberately calls a non-existent endpoint
- **Multiple Requests**: Sends several requests simultaneously

### 3. Custom Metrics Demo
- **Counter Metrics**: Track shopping cart additions/removals with `recordIncr()`
- **Gauge Metrics**: Monitor current cart size with `recordGauge()`
- **Up/Down Counters**: Track active users with `recordUpDownCounter()`
- **Histogram Metrics**: Record API response times and page load times with `recordHistogram()`

### 4. Interaction & Tracing Demo
- **Click Counter**: Tracks button clicks with custom logging
- **Dropdown**: Records selection changes
- **Toggle Switch**: Logs state changes
- **Synchronous Spans**: Form submission with automatic span completion using `startSpan()`
- **Asynchronous Spans**: Form submission with manual span control using `startManualSpan()`

## Viewing Data in LaunchDarkly

1. Log in to your LaunchDarkly account
2. Navigate to the Observability section
3. You'll see:
   - **Error Events**: All captured errors with stack traces and context
   - **Session Replays**: Video-like recordings of user sessions
   - **Network Activity**: HTTP requests with timing and status
   - **Custom Logs**: Events logged via `LDObserve.log()`
   - **Metrics**: Auto-generated metrics for Web Vitals (CLS, FCP, LCP, etc.)

## Metrics Automatically Captured

The observability plugin automatically tracks these performance metrics:

- **Cumulative Layout Shift (CLS)** - P95, P99, Average
- **Document Load Latency** - P95, P99, Average
- **First Contentful Paint (FCP)** - P95, P99, Average
- **First Input Delay (FID)** - P95, P99, Average
- **Interaction to Next Paint (INP)** - P95, P99, Average
- **Largest Contentful Paint (LCP)** - P95, P99, Average
- **Time to First Byte (TTFB)** - P95, P99, Average
- **Error Rate** - Percentage of users experiencing errors

## Configuration Options

### Observability Plugin

```javascript
new Observability({
  // Distributed Tracing Configuration
  tracingOrigins: true,              // Option 1: Trace ALL requests (demo/testing)
  // tracingOrigins: ['https://api.example.com'],  // Option 2: Specific domains (RECOMMENDED for production)
  // tracingOrigins: [/^https:\/\/.*\.example\.com$/],  // Option 3: Regex patterns
  
  // Network Recording Configuration
  networkRecording: {
    enabled: true,                   // Record network requests
    recordHeadersAndBody: true       // Include headers and body data
  },
  
  // Manual Start (Optional - for user consent flows)
  // manualStart: true,               // Don't start automatically
  // Then call: LDObserve.start()
})
```

#### Distributed Tracing (`tracingOrigins`)

Controls which backend APIs receive distributed tracing headers for request attribution:

| Configuration | Description | Use Case |
|--------------|-------------|----------|
| `true` | Traces ALL outgoing HTTP requests | Demos, testing, internal tools |
| `['https://api.example.com']` | Traces only specific domains | **Production (RECOMMENDED)** |
| `[/regex/]` | Regex pattern matching | Dynamic/multi-environment setups |

**Important**: Setting `tracingOrigins: true` adds tracing headers to ALL requests. For production, specify only your backend domains to avoid sending headers to third-party services.

### Session Replay Plugin

```javascript
new SessionReplay({
  privacySetting: 'none',  // Options: 'none', 'default', 'strict'
  
  // Manual Start (Optional - for user consent flows)
  // manualStart: true,
  // Then call: LDRecord.start({ forceNew: true })
})
```

#### Privacy Settings

Choose the privacy level that matches your compliance requirements:

| Setting | What's Recorded | What's Redacted | Use Case |
|---------|----------------|-----------------|----------|
| `none` | Everything (text, inputs, images) | Nothing | Internal tools, demos, testing |
| `default` | UI interactions, layout | Text matching PII patterns (emails, phones, SSNs, credit cards) | **Most production apps (RECOMMENDED)** |
| `strict` | Only interactions and structure | All text content and images | Highly sensitive applications (healthcare, finance) |

#### Privacy & Compliance Considerations

Even with privacy settings, session replay captures user behavior. Ensure you:

1. **Disclose data collection** in your privacy policy
2. **Obtain user consent** where required by law (GDPR, CCPA, etc.)
3. **Use `manualStart: true`** to start recording only after consent
4. **Review recorded sessions** to ensure no sensitive data is captured

**Example: Manual Start with User Consent**

```javascript
// Initialize with manualStart
new Observability({ manualStart: true, /* ... */ }),
new SessionReplay({ manualStart: true, privacySetting: 'strict' })

// Later, after user consent:
if (userHasConsented) {
  LDObserve.start();
  LDRecord.start({ forceNew: true, silent: false });
}
```

## Feature Flag Setup

This demo includes a feature flag example to show how observability integrates with LaunchDarkly's core feature flagging functionality.

### Creating the Feature Flag

1. Log in to your LaunchDarkly dashboard
2. Navigate to your project and environment
3. Create a new boolean flag with the key: `releaseFancyWidget`
4. Toggle the flag **ON** to see the Fancy Widget component appear in the demo
5. Toggle it **OFF** to hide the component

The application will automatically react to flag changes in real-time thanks to LaunchDarkly's streaming connection.

### How It Works

```javascript
// In DashboardLayout.jsx
function DashboardLayout({ flags }) {
  return (
    <>
      {/* Conditional rendering based on flag */}
      {flags.releaseFancyWidget && (
        <ErrorBoundary>
          <FancyWidget />
        </ErrorBoundary>
      )}
    </>
  );
}

export default withLDConsumer()(DashboardLayout);
```

The `withLDConsumer()` HOC provides access to all feature flags, and the component re-renders automatically when flags change.

## Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```

### Production Considerations

When deploying to production:

1. **CSP Headers**: Set Content-Security-Policy via HTTP headers (not `<meta>` tags) for better security:
   ```
   Content-Security-Policy: connect-src 'self' https://clientstream.launchdarkly.com https://events.launchdarkly.com https://pub.observability.app.launchdarkly.com https://otel.observability.app.launchdarkly.com; worker-src data: blob:
   ```

2. **Tracing Origins**: Update `tracingOrigins` to specify only your backend domains:
   ```javascript
   tracingOrigins: ['https://api.yourapp.com']
   ```

3. **Privacy Settings**: Use `privacySetting: 'default'` or `'strict'` for session replay

4. **Environment Variables**: Use separate `.env` files for different environments

## Resources

- [LaunchDarkly JavaScript SDK Observability Docs](https://launchdarkly.com/docs/sdk/observability/javascript)
- [LaunchDarkly React SDK Docs](https://launchdarkly.com/docs/sdk/client-side/react/react-web)
- [Observability Plugin API Docs](https://launchdarkly.github.io/observability-sdk/packages/@launchdarkly/observability/interfaces/api%5Fobserve.Observe.html)
- [Session Replay API Docs](https://launchdarkly.github.io/observability-sdk/packages/@launchdarkly/observability/interfaces/api%5Frecord.Record.html)

## Support

For issues or questions:
- Visit [LaunchDarkly Support](https://support.launchdarkly.com/)
- Check the [LaunchDarkly Community](https://launchdarkly.com/community/)

## License

This demo application is provided as-is for educational purposes.

