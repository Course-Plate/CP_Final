// /history/index.js

import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, BackHandler} from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useFont } from "../../context/FontContext";  // FontContext 가져오기
import { common, lightColors, darkColors } from '../../styles';

export default function HistoryScreen() {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const { fontsLoaded } = useFont();  // 폰트 로드 상태 가져오기
    const colors = isDarkMode ? darkColors : lightColors;

    const historyList = [
        { id: '1', date: '2025-01-01', region: '서울 종로구' },
    ];

    const handleBackPress = () => {
        router.back();
        return true;
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

    if (!fontsLoaded) {
        return null; // 폰트가 로드될 때까지 아무것도 렌더링하지 않음

    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Stack.Screen options={{ title: '코스 검색 기록' }} />
            <ScrollView style={{ padding: 20 }}>
                {historyList.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => router.push(`/history/${item.id}`)}
                        style={[common.cardBox, {
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            backgroundColor: colors.card,
                            minHeight: 50,
                            marginHorizontal: 0,
                            marginBottom: 15,
                        }]}
                    >
                        <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 20 }}>{item.date}</Text>
                        <Text style={{ color: colors.text, fontSize: 18 }}>여행 지역: {item.region}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
