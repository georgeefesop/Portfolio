'use client';

import React from 'react';

interface InstrumentButtonProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    isVibrantMode?: boolean;
    style?: React.CSSProperties;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

export default function InstrumentButton({
    children,
    onClick,
    className = '',
    isVibrantMode = false,
    style = {},
    type = 'button',
    disabled = false
}: InstrumentButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`
                relative z-[10] 
                text-black rounded-full 
                pointer-events-auto 
                transition-all duration-300 
                hover:-translate-y-0.5 
                hover:brightness-130 
                active:translate-y-0 
                ${isVibrantMode
                    ? 'bg-white'
                    : 'bg-[var(--color-accent-primary)] [.vibrant-mode_&]:bg-white'
                }
                ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none shadow-none' : ''}
                ${className}
            `}
            disabled={disabled}
            style={{
                fontFamily: '"Instrument Sans", sans-serif',
                fontWeight: 700,
                fontVariationSettings: '"wght" 700, "wdth" 100',
                ...style
            }}
        >
            {children}
        </button>
    );
}
