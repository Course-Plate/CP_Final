// context/FontContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFonts, Candal_400Regular } from '@expo-google-fonts/candal';
import * as SplashScreen from 'expo-splash-screen';
import {Jua_400Regular} from "@expo-google-fonts/jua";

const FontContext = createContext({
    fontsLoaded: false,
});

export function FontProvider({ children }) {

    const [fontsLoaded] = useFonts({
        Candal: Candal_400Regular,
        Jua: Jua_400Regular,
    });

    useEffect(() => {

        const keepSplash = async () => {
            try {
                await SplashScreen.preventAutoHideAsync();
            } catch (e) {
                console.warn('[FontProvider] SplashScreen.preventAutoHideAsync 실패', e);
            }
        };
        keepSplash();
    }, []);

    useEffect(() => {
        const hideSplash = async () => {
            if (fontsLoaded) {
                console.log('[FontProvider] 폰트 로드 완료');
                try {
                    await SplashScreen.hideAsync();
                } catch (err) {
                    console.warn('[FontProvider] SplashScreen 숨김 실패', err);
                }
            }
        };
        hideSplash();
    }, [fontsLoaded]);

    return (
        <FontContext.Provider value={{ fontsLoaded }}>
            {children}
        </FontContext.Provider>
    );
}

export function useFont() {
    return useContext(FontContext);
}
