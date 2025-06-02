import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import { useFont } from "../../context/FontContext";
import { common, lightColors, darkColors } from '../../styles';

export default function HistoryScreen() {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const { fontsLoaded } = useFont();
    const colors = isDarkMode ? darkColors : lightColors;

    const [historyList, setHistoryList] = useState([]);

    const handleBackPress = () => {
        router.back();
        return true;
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const raw = await AsyncStorage.getItem('searchHistory');
                if (raw) {
                    setHistoryList(JSON.parse(raw));
                }
            } catch (e) {
                console.error('❌ 검색 기록 로딩 실패:', e);
            }
        };
        loadHistory();
    }, []);

    if (!fontsLoaded) return null;

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Stack.Screen options={{ title: '코스 검색 기록' }} />
            <ScrollView style={{ padding: 20 }}>
                {historyList.length === 0 ? (
                    <Text style={{ color: colors.text, fontSize: 16 }}>기록이 없습니다.</Text>
                ) : (
                    historyList.map((item, index) => (
                        <TouchableOpacity
                            key={index.toString()}
                            onPress={() => router.push({
                                pathname: '/history/detail',
                                params: {
                                    region: item.region,
                                    date: item.date,
                                },
                            })}
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
                    ))
                )}
            </ScrollView>
        </View>
    );
}
