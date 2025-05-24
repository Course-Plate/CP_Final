import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        (async () => {
            const stored = await AsyncStorage.getItem('isDarkMode');
            if (stored !== null) setIsDarkMode(JSON.parse(stored));
        })();
    }, []);

    const toggleDarkMode = async () => {
        const next = !isDarkMode;
        setIsDarkMode(next);
        await AsyncStorage.setItem('isDarkMode', JSON.stringify(next));
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
