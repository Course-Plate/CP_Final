// context/AppContext.js
import React from 'react';
import { FontProvider } from './FontContext';
import { PreferencesProvider } from './PreferencesContext';
import {PlacesProvider} from "./PlacesContext";

export function AppProviders({ children }) {
    return (
        <FontProvider>
            <PreferencesProvider>
                <PlacesProvider>
                    {children}
                </PlacesProvider>
            </PreferencesProvider>
        </FontProvider>
    );
}
