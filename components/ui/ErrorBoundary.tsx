'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-[#05050A] relative overflow-hidden rounded-xl border border-zinc-800/30">
                    <div className="absolute inset-0 opacity-[0.10] pointer-events-none"
                        style={{
                            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />
                    <div className="z-10 text-center p-6 max-w-sm">
                        <div className="text-zinc-500 font-mono text-xs mb-2 uppercase tracking-widest">System Status</div>
                        <div className="text-zinc-400 text-sm">Prototype currently offline.</div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
