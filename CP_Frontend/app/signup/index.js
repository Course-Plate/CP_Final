import React, {useEffect, useState} from 'react';
import {
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    View,
    Text,
    TouchableOpacity,
    Alert, BackHandler,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import {common, auth, lightColors, darkColors, preference} from '../../styles';
import { useTheme } from '../../context/ThemeContext';
import { BASE_URL } from "../../BASE_URL";
import axios from 'axios';

export default function SignUpScreen() {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const colors = isDarkMode ? darkColors : lightColors;

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [sex, setSex] = useState('');
    const [authCode, setAuthCode] = useState('');
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
        userId.trim() &&
        password.trim() &&
        confirmPassword.trim() &&
        password === confirmPassword &&
        email.trim() &&
        sex.trim() &&
        authCode.trim() &&
        isVerified;

    const handleBackPress = () => {
        router.back(); // 뒤로 가기
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                handleBackPress(); // 뒤로 가기 호출
                return true; // 뒤로 가기 이벤트를 처리했다고 알려줌
            }
        );

        return () => backHandler.remove(); // 컴포넌트 언마운트 시 이벤트 제거
    }, []);

    // 전화번호 인증
    const handleRequestVerification = async () => {
        if (!phone) {
            Alert.alert('오류', '전화번호를 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/auth/send-sms`, {
                phoneNum: phone.replace(/[^0-9]/g, '') // 숫자만 추출하여 전송
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            Alert.alert('성공', response.data); // 서버 메시지 출력
            console.log('📤 인증번호 요청:', phone);
            setShowCodeInput(true);
        } catch (error) {
            console.error('❌ 인증번호 요청 실패:', error);
            Alert.alert('실패', '인증번호 요청 중 문제가 발생했습니다.');
        }
    };


    // 회원가입
    const handleSignup = async () => {
        if (!isFormValid) {
            Alert.alert('입력 오류', '모든 항목을 올바르게 입력해주세요.');
            return;
        }

        try {
            // 1. 인증번호 검증 요청
            const verifyResponse = await axios.post(`${BASE_URL}/auth/verify-sms`, {
                phoneNum: phone.replace(/[^0-9]/g, ''),
                authCode: authCode // 사용자가 입력한 인증번호 변수
            });

            const isCodeValid = verifyResponse.data === true;

            if (!isCodeValid) {
                Alert.alert('인증 실패', '인증번호가 일치하지 않습니다.');
                return;
            }

            // 2. 인증 성공 → 회원가입 요청
            const signupResponse = await axios.post(`${BASE_URL}/auth/signup`, {
                userId: userId, // 사용자 ID
                userName: name,
                password: password,
                phoneNum: phone.replace(/[^0-9]/g, ''),
                email: email,
                sex: sex
            });

            // 3. 성공 처리
            Alert.alert('회원가입 완료', `${name}님, 환영합니다!`);
            console.log('👤 회원가입 성공:', signupResponse.data);
            router.push('/login');

        } catch (error) {
            console.error('❌ 회원가입 또는 인증 실패:', error);
            Alert.alert('오류', '회원가입 중 문제가 발생했습니다.');
        }
    };



    const renderButton = (label, selected, onPress, key) => (
        <TouchableOpacity
            key={key}
            onPress={onPress}
            style={[
                preference.optionBtn,
                selected && preference.optionBtnSelected,
            ]}
        >
            <Text
                style={[
                    preference.optionText,
                    selected && preference.optionTextSelected,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );






    // ------------------------------------------------------------------------ //






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
                            value={authCode}
                            onChangeText={(text) => {
                                setAuthCode(text);
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
                        placeholder="아이디"
                        value={userId}
                        onChangeText={setUserId}
                        backgroundColor={colors.inputBg}
                        color={colors.text}
                        borderColor={colors.border}
                        placeholderTextColor={colors.placeholder}
                    />

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

                    <CustomInput
                        placeholder="이메일"
                        value={email}
                        onChangeText={setEmail}
                        backgroundColor={colors.inputBg}
                        color={colors.text}
                        borderColor={colors.border}
                        placeholderTextColor={colors.placeholder}
                    />

                    <Text style={[preference.label, { color: colors.text }]}>성별</Text>
                    <View style={preference.optionRow}>
                        {['남자', '여자'].map((s) =>
                            renderButton(s, sex === s, () => setSex(s), s)
                        )}
                    </View>

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
