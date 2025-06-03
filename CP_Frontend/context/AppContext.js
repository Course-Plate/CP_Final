// context/AppContext.js
import React from 'react';
import { FontProvider } from './FontContext';

export function AppProviders({ children }) {
    return (
        <FontProvider>
            {children}
        </FontProvider>
    );
}
