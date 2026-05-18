import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCcw, AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-sage-100 dark:border-gray-800 mx-4">
          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mb-6 text-rose-500">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-black text-sage-900 dark:text-white mb-3 tracking-tight">
            Something Went Wrong
          </h2>
          <p className="text-sage-600 dark:text-sage-400 mb-8 max-w-md font-medium">
            {this.props.fallbackMessage || "An unexpected error occurred. Don't worry — your data is safe."}
          </p>
          <button
            onClick={this.handleRetry}
            className="px-8 py-4 bg-sage-900 dark:bg-sage-200 text-white dark:text-sage-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg flex items-center gap-3"
          >
            <RefreshCcw size={16} /> Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
