import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    View,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import { common, auth, lightColors, darkColors } from '../../styles';
import { useTheme } from '../../context/ThemeContext';

export default function Index() {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const colors = isDarkMode ? darkColors : lightColors;

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [showCodeInput, setShowCodeInput] = useState(false);

    const confirmBorderColor = !confirmPassword
        ? colors.border
        : password === confirmPassword
            ? 'green'
            : 'red';

    const isFormValid =
        name.trim() &&
        phone.trim() &&
        password.trim() &&
        confirmPassword.trim() &&
        password === confirmPassword &&
        isVerified;

    const handleRequestVerification = () => {
        if (!phone) {
            Alert.alert('오류', '전화번호를 입력해주세요.');
            return;
        }

        Alert.alert('인증번호 전송됨');
        console.log('📤 인증번호 요청:', phone);
        setShowCodeInput(true);
    };

    const handleSignup = async () => {
        if (!isFormValid) {
            Alert.alert('입력 오류', '모든 항목을 올바르게 입력해주세요.');
            return;
        }

        Alert.alert('회원가입 완료', `${name}님, 환영합니다!`);
        console.log('👤 회원가입 요청:', { name, phone, password });

        await AsyncStorage.setItem('userName', name);
        router.push('/login');
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={80}
        >
            <ScrollView
                contentContainerStyle={[
                    common.container,
                    { backgroundColor: colors.background },
                ]}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={[common.title, { color: colors.text }]}>회원가입</Text>

                <View
                    style={{
                        backgroundColor: colors.card,
                        padding: 24,
                        borderRadius: 16,
                        width: '100%',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        marginBottom: 32,
                    }}
                >
                    <CustomInput
                        placeholder="이름"
                        value={name}
                        onChangeText={setName}
                        backgroundColor={colors.inputBg}
                        color={colors.text}
                        borderColor={colors.border}
                        placeholderTextColor={colors.placeholder}
                    />

                    <View style={auth.row}>
                        <View style={{ flex: 1 }}>
                            <CustomInput
                                placeholder="전화번호 (- 없이)"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                backgroundColor={colors.inputBg}
                                color={colors.text}
                                borderColor={colors.border}
                                placeholderTextColor={colors.placeholder}
                            />
                        </View>
                        <TouchableOpacity
                            style={[auth.verifyButton, { backgroundColor: colors.accent }]}
                            onPress={handleRequestVerification}
                        >
                            <Text style={auth.verifyText}>
                                {showCodeInput ? '재전송' : '인증요청'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {showCodeInput && (
                        <CustomInput
                            placeholder="인증번호 입력"
                            value={code}
                            onChangeText={(text) => {
                                setCode(text);
                                if (text.length >= 4) setIsVerified(true);
                            }}
                            keyboardType="number-pad"
                            backgroundColor={colors.inputBg}
                            color={colors.text}
                            borderColor={colors.border}
                            placeholderTextColor={colors.placeholder}
                        />
                    )}

                    <CustomInput
                        placeholder="비밀번호"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        backgroundColor={colors.inputBg}
                        color={colors.text}
                        borderColor={colors.border}
                        placeholderTextColor={colors.placeholder}
                    />

                    <CustomInput
                        placeholder="비밀번호 확인"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        backgroundColor={colors.inputBg}
                        color={colors.text}
                        borderColor={confirmBorderColor}
                        placeholderTextColor={colors.placeholder}
                    />

                    <PrimaryButton
                        title="완료"
                        onPress={handleSignup}
                        disabled={!isFormValid}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
