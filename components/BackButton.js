import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { lightColors, darkColors } from '../styles';

export default function BackButton({ label = '뒤로가기', style, textStyle }) {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const colors = isDarkMode ? darkColors : lightColors;

    return (
        <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.button, { backgroundColor: colors.card }, style]}
            activeOpacity={0.8}
        >
            <Text style={[styles.text, { color: colors.text }, textStyle]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 12,
        marginTop: 30,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
