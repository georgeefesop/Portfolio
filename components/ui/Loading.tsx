'use client';

interface LoadingProps {
    progress: number;
}

export default function Loading({ progress }: LoadingProps) {
    return (
        <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-accent border-t-transparent 
                        rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg text-primary font-mono">
                    Loading {progress}%
                </p>
            </div>
        </div>
    );
}
