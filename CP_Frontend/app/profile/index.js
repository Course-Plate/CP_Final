// app/profile/index.js

import {View, Text, Image, BackHandler} from 'react-native';
import common from "../../styles/common";
import { useFont } from "../../context/FontContext";
import {useEffect} from "react";
import { useRouter } from "expo-router";

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

            {/* 리뷰 포인트 */}
            <Text style={[common.buttonText, {color: 'black', fontSize: 25, marginLeft: 0, marginBottom: 5}]}>Review Point</Text>
            <View style={common.view}><Text style={[common.buttonText, {color: 'black'}]}>50 P</Text></View>

        </View>
    );
}