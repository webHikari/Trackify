import React from "react";

export const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Trackify</h1>
      <p className="intro-text">
        Trackify is a powerful analytics library designed to help you understand user experience on your website.
        Use the navigation menu on the left to explore various metrics and statistics.
      </p>
      
      <div className="feature-card">
        <h2>Key Features:</h2>
        <ul>
          <li>
            <span className="feature-icon">⏱️</span>
            <span className="feature-text">
              <strong>Time Tracking</strong> - Monitor how long users spend on each page
            </span>
          </li>
          <li>
            <span className="feature-icon">📊</span>
            <span className="feature-text">
              <strong>User Activity Analysis</strong> - View user engagement by hour and day of week
            </span>
          </li>
          <li>
            <span className="feature-icon">📈</span>
            <span className="feature-text">
              <strong>Page Statistics</strong> - Track page visits and performance
            </span>
          </li>
          <li>
            <span className="feature-icon">⏳</span>
            <span className="feature-text">
              <strong>Visit Timeline</strong> - Visualize traffic patterns over time
            </span>
          </li>
        </ul>
      </div>

      <div className="feature-card getting-started">
        <h2>Getting Started:</h2>
        <p>
          To integrate Trackify into your project, simply wrap your application with the 
          <code>TrackifyProvider</code> component and start collecting valuable insights about 
          your users' behavior.
        </p>
        <div className="code-example">
          <pre>
            <code>
{`import { TrackifyProvider } from "trackify";

return (
  <TrackifyProvider TR_URL="https://your-analytics-endpoint.com">
    <App />
  </TrackifyProvider>
);`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}; 