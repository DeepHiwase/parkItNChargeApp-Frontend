import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#f8d7da', color: '#721c24' }}>
          <h2>Something went wrong.</h2>
          <p>Please try again later.</p>
          <p>If recently added the station, please refresh the page to add more stations.</p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;