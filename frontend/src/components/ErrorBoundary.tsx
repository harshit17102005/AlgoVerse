import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true, error: _, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-rose-500 bg-zinc-950 min-h-screen flex flex-col items-start justify-center font-mono">
                    <h1 className="text-3xl font-bold mb-4">Application Crashed</h1>
                    <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 w-full max-w-4xl overflow-auto">
                        <h2 className="text-xl font-semibold mb-2">{this.state.error?.message}</h2>
                        <pre className="text-sm mt-4 text-rose-400">
                            {this.state.error?.stack}
                        </pre>
                        <pre className="text-sm mt-4 text-zinc-400">
                            {this.state.errorInfo?.componentStack}
                        </pre>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
