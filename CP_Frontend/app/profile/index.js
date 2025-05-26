// app/profile/index.js

import {View, Text, Image, BackHandler, Alert, TouchableOpacity} from 'react-native';
import common from "../../styles/common";
import { useFont } from "../../context/FontContext";
import React, {useEffect, useState} from "react";
import {useLocalSearchParams, useRouter} from "expo-router";
import axios from "axios";
import {BASE_URL} from "../../BASE_URL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { home } from "../../styles";
import { useTheme } from "../../context/ThemeContext";

export default function Profile() {

    const router = useRouter();
    const params = useLocalSearchParams();
    const { fontsLoaded } = useFont();  // 폰트 로드 상태 가져오기
    const { isDarkMode } = useTheme();
    const [User, setUser] = useState({});

    if (!fontsLoaded) {
        return null; // 폰트가 로드될 때까지 아무것도 렌더링하지 않음
    }

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

    useEffect(() => {
        const loadUserData = () => {
            setUser(JSON.parse(params.User));
        }
        loadUserData();
    }, []);


    const confirmAndDeleteUser = () => {
        Alert.alert(
            "회원 삭제 확인",
            "정말로 회원을 삭제하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel"
                },
                {
                    text: "삭제",
                    style: "destructive",
                    onPress: () => deleteUser()
                }
            ]
        );
    };


    const deleteUser = async () => {
        try {
            await axios.delete(`${BASE_URL}/users/delete`, { params: { userId: User.userId }});
            await AsyncStorage.clear();

            Alert.alert("삭제 완료", "회원이 삭제되었습니다.");
            router.replace('/login');
        } catch (e) {
            Alert.alert("삭제 실패", "오류가 발생했습니다.");
            console.log(e.message);
        }
    }

    return (
        <View style={common.startContainer}>

            <Image
                source={require('../../assets/logo/logo_clean.png')}
                style={[common.logo, {width: 300, height: 300}]}
            />

            {/* 사용자이름 */}
            <Text style={[common.buttonText, {color: 'black', fontSize: 25, marginLeft: 0, marginBottom: 5}]}>Name</Text>
            <View style={[common.view, {borderWidth: 0.3}]}><Text style={[common.buttonText, {color: 'black'}]}>{User.userName}</Text></View>

            {/* 아이디 */}
            <Text style={[common.buttonText, {color: 'black', fontSize: 25, marginLeft: 0, marginBottom: 5}]}>ID</Text>
            <View style={[common.view, {borderWidth: 0.3}]}><Text style={[common.buttonText, {color: 'black'}]}>{User.userId}</Text></View>

            {/* 이메일 */}
            <Text style={[common.buttonText, {color: 'black', fontSize: 25, marginLeft: 0, marginBottom: 5}]}>Email</Text>
            <View style={[common.view, {borderWidth: 0.3}]}><Text style={[common.buttonText, {color: 'black'}]}>{User.email}</Text></View>

            {/* 전화번호 */}
            <Text style={[common.buttonText, {color: 'black', fontSize: 25, marginLeft: 0, marginBottom: 5}]}>Phone</Text>
            <View style={[common.view, {borderWidth: 0.3}]}><Text style={[common.buttonText, {color: 'black'}]}>{User.phoneNum}</Text></View>

            {/* 회원탈퇴 */}
            <TouchableOpacity
                onPress={() => confirmAndDeleteUser()}
                style={[
                    home.tabButton,
                    { backgroundColor: isDarkMode ? '#444' : '#eee' }
                ]}
            >
                <Text
                    style={[
                        { color: isDarkMode ? '#aaa' : '#333', fontWeight: 'bold' }
                    ]}
                >
                    회원 탈퇴
                </Text>
            </TouchableOpacity>

        </View>
    );
}