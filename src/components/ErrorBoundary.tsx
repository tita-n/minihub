'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MiniHub Error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="text-6xl">⚠️</div>
            <h1 className="text-2xl font-bold text-primary">
              Something went wrong
            </h1>
            <p className="text-muted-foreground">
              We're sorry, but MiniHub encountered an unexpected error. 
              This has been logged for our team to investigate.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="bg-secondary p-4 rounded-lg text-left">
                <summary className="cursor-pointer text-sm font-semibold mb-2">
                  Error Details (Development)
                </summary>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p><strong>Error:</strong> {this.state.error.message}</p>
                  <p><strong>Stack:</strong></p>
                  <pre className="bg-muted p-2 rounded overflow-x-auto">
                    {this.state.error.stack}
                  </pre>
                </div>
              </details>
            )}
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-2 bg-muted text-foreground font-semibold rounded-lg hover:bg-muted/80 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easy error boundary wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Props
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}