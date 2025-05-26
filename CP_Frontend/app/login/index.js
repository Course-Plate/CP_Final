import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Image, TouchableOpacity, Alert, BackHandler} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { common, auth, lightColors, darkColors } from '../../styles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../BASE_URL";
import axios from 'axios';

export default function LoginScreen() {
    const router = useRouter();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const { isDarkMode } = useTheme();

    const colors = isDarkMode ? darkColors : lightColors;


    useEffect(() => {
        const backAction = () => {
            // Alert을 띄워 사용자에게 확인을 요청
            Alert.alert(
                "종료", // 제목
                "CoursePlate를 종료하시겠습니까?", // 내용
                [
                    {
                        text: "취소", // 취소 버튼
                        onPress: () => null, // 아무 동작도 하지 않음
                        style: "cancel",
                    },
                    {
                        text: "확인", // 확인 버튼
                        onPress: () => BackHandler.exitApp(), // 앱 종료
                    },
                ],
                { cancelable: false } // Alert 밖을 클릭해도 닫히지 않음
            );
            return true; // 뒤로가기 이벤트를 처리했음을 반환
        };

        // 뒤로가기 버튼 이벤트 리스너 추가
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        // 컴포넌트 언마운트 시 리스너 제거
        return () => backHandler.remove();
    }, []);


    // 로그인
    const handleLogin = async () => {
        if (!userId || !password) {
            Alert.alert('입력 오류', '아이디와 비밀번호를 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, {
                userId,
                password
            });

            const token = response.data.token;

            if (token) {
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('userId', userId);

                Alert.alert('로그인 성공', `${userId}님 환영합니다!`);
                console.log('✅ 로그인 성공:', token);
                router.replace('/home');
            } else {
                Alert.alert('오류', '토큰이 존재하지 않습니다.');
            }

        } catch (error) {
            console.error('❌ 로그인 실패:', error);
            if (error.response && error.response.status === 400) {
                Alert.alert('로그인 실패', '아이디 또는 비밀번호가 올바르지 않습니다.');
            } else {
                Alert.alert('오류', '로그인 중 문제가 발생했습니다.');
            }
        }
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
                placeholder="아이디"
                placeholderTextColor={colors.placeholder}
                value={userId}
                onChangeText={setUserId}
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
