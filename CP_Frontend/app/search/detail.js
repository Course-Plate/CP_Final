// app/search/detail.js
import React, { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Linking,
    Alert,
    Platform,
    Image,
    BackHandler
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { lightColors, darkColors } from '../../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailScreen() {
    const {
        title,
        desc,
        address,
        tel,
        link,
        category,
        mapx,
        mapy,
    } = useLocalSearchParams();

    const { isDarkMode } = useTheme();
    const router = useRouter();
    const colors = isDarkMode ? darkColors : lightColors;

    const cleanTitle = title?.replace(/<[^>]+>/g, '') || '도착지';

    // ✅ 리뷰 자격 저장
    const markStoreAsEligible = async () => {
        const timestamp = Date.now();
        const expiresAt = timestamp + 2 * 24 * 60 * 60 * 1000; // 2일

        const storeData = {
            storeKey: `${address}_${title}`,
            title: cleanTitle,
            address,
            mapx,
            mapy,
            timestamp,
            expiresAt,
        };

        await AsyncStorage.setItem('review_eligible', JSON.stringify(storeData));
        console.log('✅ review_eligible 저장됨:', storeData);
    };

    const openNaverMap = async () => {
        if (!mapx || !mapy) {
            Alert.alert('오류', '지도 정보를 찾을 수 없습니다.');
            return;
        }

        // ✅ 먼저 저장
        await markStoreAsEligible();

        const lat = parseFloat(mapy) / 1e7;
        const lng = parseFloat(mapx) / 1e7;

        const encodedName = encodeURIComponent(cleanTitle);
        const url = Platform.select({
            ios: `nmap://route/car?dlat=${lat}&dlng=${lng}&dname=${encodedName}&appname=com.khonan.myproject`,
            android: `nmap://route/car?dlat=${lat}&dlng=${lng}&dname=${encodedName}&appname=com.khonan.myproject`,
        });

        Linking.openURL(url).catch(() => {
            Alert.alert(
                '네이버 지도 앱 필요',
                '앱이 설치되어 있지 않아 실행할 수 없습니다. 설치하시겠습니까?',
                [
                    { text: '취소', style: 'cancel' },
                    {
                        text: '설치하기',
                        onPress: () =>
                            Linking.openURL(
                                Platform.OS === 'ios'
                                    ? 'https://apps.apple.com/app/id311867728'
                                    : 'https://play.google.com/store/apps/details?id=com.nhn.android.nmap'
                            ),
                    },
                ]
            );
        });
    };

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
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>{cleanTitle}</Text>

            <Text style={[styles.label, { color: colors.text }]}>카테고리</Text>
            <Text style={[styles.value, { color: colors.text }]}>{category}</Text>

            <Text style={[styles.label, { color: colors.text }]}>주소</Text>
            <Text style={[styles.value, { color: colors.text }]}>{address}</Text>

            <Text style={[styles.label, { color: colors.text }]}>전화번호</Text>
            <Text style={[styles.value, { color: colors.text }]}>{tel || '정보 없음'}</Text>

            <Text style={[styles.label, { color: colors.text }]}>설명</Text>
            <Text style={[styles.value, { color: colors.text }]}>{desc || '없음'}</Text>

            <TouchableOpacity
                onPress={openNaverMap}
                style={[styles.button, { backgroundColor: colors.accent }]}
            >
                <Text style={styles.buttonText}>🚗 네이버 길찾기</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.back()}
                style={[styles.button, { marginTop: 12, backgroundColor: colors.border }]}
            >
                <Text style={[styles.buttonText, { color: colors.text }]}>← 뒤로가기</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    label: {
        marginTop: 12,
        fontWeight: '600',
        fontSize: 14,
    },
    value: {
        fontSize: 14,
        marginTop: 4,
    },
    button: {
        marginTop: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});
