import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert, BackHandler, ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import SlideDrawer from '../../components/SlideDrawer';
import { useTheme } from '../../context/ThemeContext';
import {
    common,
    home,
    lightColors,
    darkColors,
} from '../../styles';
import { useFont } from "../../context/FontContext";

export default function HomeScreen() {

    const router = useRouter();
    const { fontsLoaded } = useFont();  // 폰트 로드 상태 가져오기
    const { isDarkMode } = useTheme();
    const [userName, setUserName] = useState('사용자');
    const [menuOpen, setMenuOpen] = useState(false);
    const [region, setRegion] = useState(null);
    const [selectedTab, setSelectedTab] = useState('region');
    const [preferences, setPreferences] = useState(null);
    const colors = isDarkMode ? darkColors : lightColors;

    if (!fontsLoaded) {
        return null; // 폰트가 로드될 때까지 아무것도 렌더링하지 않음
    }

    
    useEffect(() => {
        const loadData = async () => {
            const name = await AsyncStorage.getItem('userName');
            if (name) setUserName(name);

            const regionData = await AsyncStorage.getItem('selectedRegion');
            if (regionData) setRegion(JSON.parse(regionData));

            const preferenceData = await AsyncStorage.getItem('preferences');
            if (preferenceData) setPreferences(JSON.parse(preferenceData));
        };
        loadData();
    }, []);

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


    // 로그아웃
    const handleLogout = async () => {
        await AsyncStorage.clear();
        setMenuOpen(false);
        router.replace('/login');
    };


    return (
        <View style={[{ flex: 1, backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* 상단 배경 */}
            <View style={home.header}>
                <ImageBackground
                    source={require('../../assets/main-bg.png')}
                    style={home.backgroundImage}
                />

                <View style={home.topRow}>
                    <View style={home.leftProfile}>
                        <TouchableOpacity onPress={() => router.push('/profile')}>
                            <View style={common.avatarCircle} />
                        </TouchableOpacity>
                        <Text style={[home.nameText]}>{userName}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setMenuOpen(true)}>
                        <Image
                            source={require('../../assets/home/slider.png')}
                            style={{ width: 28, height: 28 }}
                        />
                    </TouchableOpacity>
                </View>

                <Text style={common.headerText1}>Course Plate</Text>
                <Text style={common.headerText2}>Find your favorite food!</Text>
            </View>

            {/* 탭 버튼 */}
            <View style={home.tabRow}>
                {['region', 'preference'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setSelectedTab(tab)}
                        style={[
                            home.tabButton,
                            selectedTab === tab
                                ? home.tabActive
                                : { backgroundColor: isDarkMode ? '#444' : '#eee' },
                        ]}
                    >
                        <Text
                            style={[
                                selectedTab === tab
                                    ? home.tabTextActive
                                    : { color: isDarkMode ? '#aaa' : '#333', fontWeight: 'bold' },
                            ]}
                        >
                            {tab === 'region' ? '여행 지역' : '음식 취향'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>


            {/* 지역 카드 또는 취향 설문 카드 */}
            <View style={[common.cardBox, { backgroundColor: colors.card }]}>
                <Text style={[home.cardText, { color: colors.text, textAlign: 'left' }]}>
                    {selectedTab === 'region'
                        ? region
                            ? `${region.province} ${region.city}`
                            : '지역을 설정하지 않았습니다'
                        : preferences
                            ? `음식 취향: ${preferences.type}\n\n알레르기: ${preferences.allergy.join(', ')}\n\n매운맛: ${preferences.spicy}\n\n온도: ${preferences.temperature}\n\n예산: ${preferences.budget}`
                            : '취향 설문을 하지 않았습니다'}
                </Text>
                <TouchableOpacity
                    style={[common.button, { backgroundColor: colors.accent }]}
                    onPress={() => {
                        if (selectedTab === 'region') {
                            router.push('/preference/region');
                        } else {
                            AsyncStorage.removeItem('allergy');
                            router.push('/preference');
                        }
                    }}
                >
                    <Text style={[common.buttonText, { color: '#fff' }]}>
                        {selectedTab === 'region' ? (region ? '재선택' : '설정하기') : '취향 설문하기'}
                    </Text>
                </TouchableOpacity>
            </View>


            {/* 하단 버튼 */}
            <View style={home.bottomRow}>
                <TouchableOpacity
                    style={[home.bottomButton, { backgroundColor: colors.card }]}
                    onPress={() => router.push('/history')}
                >
                    <Image
                        source={require('../../assets/home/history.png')}
                        style={home.bottomIcon}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[home.bottomButton, { backgroundColor: colors.card }]}
                    onPress={() => {
                        if (!region) {
                            Alert.alert('지역 미설정', '검색을 하기 위해 먼저 지역을 설정해주세요.');
                        } else {
                            router.push('/search');
                        }
                    }}
                >
                    <Image
                        source={require('../../assets/home/search.png')}
                        style={home.bottomIcon}
                    />
                </TouchableOpacity>
            </View>


            {/* 슬라이드 메뉴 */}
            <SlideDrawer
                visible={menuOpen}
                onClose={() => setMenuOpen(false)}
                backgroundColor={colors.background}
            >
                <Text style={[common.drawerTitle, { color: colors.text }]}>설정 메뉴</Text>

                <TouchableOpacity
                    style={[common.drawerItem, {
                        borderBottomColor: colors.border,
                        borderBottomWidth: 1,
                        paddingVertical: 14,
                    }]}
                    onPress={() => router.push('/home_slider/setting')}
                >
                    <Text style={{ fontSize: 16, color: colors.text }}>설정</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[common.drawerItem, {
                        borderBottomColor: colors.border,
                        borderBottomWidth: 1,
                        paddingVertical: 14,
                    }]}
                >
                    <Text style={{ fontSize: 16, color: colors.text }}>알림</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleLogout}
                    style={[common.drawerItem, { paddingVertical: 14 }]}
                >
                    <Text style={{ fontSize: 16, color: colors.text }}>로그아웃</Text>
                </TouchableOpacity>
            </SlideDrawer>
        </View>
    );
}
