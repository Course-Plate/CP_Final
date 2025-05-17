// context/PreferencesContext.js

import React, { createContext, useState, useContext } from 'react';

// Preferences 상태 초기화
const PreferencesContext = createContext();

// Preferences 상태를 제공하는 컴포넌트
export const PreferencesProvider = ({ children }) => {
    const [isLocationSet, setIsLocationSet] = useState(false);
    const [isTasteSurveyCompleted, setIsTasteSurveyCompleted] = useState(false);

    return (
        <PreferencesContext.Provider value={{ isLocationSet, setIsLocationSet, isTasteSurveyCompleted, setIsTasteSurveyCompleted }}>
            {children}
        </PreferencesContext.Provider>
    );
};

// Preferences 상태를 사용하기 위한 커스텀 훅
export const usePreferences = () => useContext(PreferencesContext);
