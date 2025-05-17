import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { common, auth, lightColors, darkColors } from '../../styles';

export default function LoginScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const { isDarkMode } = useTheme();

    const colors = isDarkMode ? darkColors : lightColors;

    const handleLogin = () => {
        if (!phone || !password) {
            Alert.alert('입력 오류', '전화번호와 비밀번호를 입력해주세요.');
            return;
        }
        console.log('로그인 시도:', { phone, password });
        Alert.alert('로그인 성공', `${phone}님 환영합니다!`);
        router.replace('/home');
    };

    return (
        <View style={[common.startContainer, { backgroundColor: colors.background }]}>
            <View style={[auth.logoCard, { backgroundColor: colors.card }]}>
                <Image
                    source={require('../../assets/logo/logo_clean.png')}
                    style={{ width: 200, height: 200, resizeMode: 'contain' }}
                />
            </View>

            <TextInput
                style={[
                    common.input,
                    {
                        backgroundColor: colors.inputBg,
                        color: colors.text,
                        borderColor: colors.border,
                        borderWidth: 1,
                    },
                ]}
                placeholder="전화번호 (- 없이)"
                placeholderTextColor={colors.placeholder}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
            />

            <TextInput
                style={[
                    common.input,
                    {
                        backgroundColor: colors.inputBg,
                        color: colors.text,
                        borderColor: colors.border,
                        borderWidth: 1,
                    },
                ]}
                placeholder="비밀번호"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={[common.button, { backgroundColor: colors.accent }]}
                onPress={handleLogin}
            >
                <Text style={[common.buttonText, { color: '#fff' }]}>로그인</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text style={{ color: colors.accent, fontWeight: '600' }}>회원가입</Text>
            </TouchableOpacity>
        </View>
    );
}
