// app/profile/index.js

import {View, Text, Image, BackHandler, Alert, TouchableOpacity} from 'react-native';
import common from "../../styles/common";
import { useFont } from "../../context/FontContext";
import React, {useEffect} from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import {BASE_URL} from "../../BASE_URL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { home } from "../../styles";

export default function Profile() {

    const router = useRouter();
    const { fontsLoaded } = useFont();  // 폰트 로드 상태 가져오기

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
        const userId = await AsyncStorage.getItem('userId');

        try {
            await axios.delete(`${BASE_URL}/users/delete`, { params: { userId }});
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

            {/* TODO: 정보 불러오기 */}

            {/* 전화번호 */}
            <Text style={[common.buttonText, {color: 'black', fontSize: 25, marginLeft: 0, marginBottom: 5}]}>Phone</Text>
            <View style={common.view}><Text style={[common.buttonText, {color: 'black'}]}>010-1234-5678</Text></View>

            {/* 비밀번호 */}
            <Text style={[common.buttonText, {color: 'black', fontSize: 25, marginLeft: 0, marginBottom: 5}]}>Password</Text>
            <View style={common.view}><Text style={[common.buttonText, {color: 'black'}]}>abcdefghijklmnop</Text></View>

            {/* 회원탈퇴 */}
            <TouchableOpacity
                key={tab}
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