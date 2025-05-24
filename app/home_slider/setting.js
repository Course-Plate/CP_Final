import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { common, setting, lightColors, darkColors } from '../../styles';

export default function SettingScreen() {
    const router = useRouter();
    const { isDarkMode, toggleDarkMode } = useTheme(); // ✅ 여기만 사용
    const colors = isDarkMode ? darkColors : lightColors;

    return (
        <View style={[common.container, { backgroundColor: colors.background }]}>
            {/* 타이틀 */}
            <Text style={[setting.title, { color: colors.text }]}>설정</Text>

            {/* 카드 박스 */}
            <View style={[setting.card, { backgroundColor: colors.card }]}>
                <View style={setting.optionRow}>
                    <Text style={[setting.optionText, { color: colors.text }]}>
                        다크 모드
                    </Text>
                    <Switch
                        value={isDarkMode}
                        onValueChange={toggleDarkMode}
                        trackColor={{ false: '#ccc', true: '#4FC3F7' }}
                        thumbColor={isDarkMode ? '#2196F3' : '#f4f3f4'}
                    />
                </View>
            </View>

            {/* 홈으로 돌아가기 */}
            <TouchableOpacity
                style={[common.button, { backgroundColor: colors.accent, marginTop: 30 }]}
                onPress={() => router.push('/home')}
            >
                <Text style={common.buttonText}>홈으로</Text>
            </TouchableOpacity>
        </View>
    );
}
