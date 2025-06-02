import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    Button,
    TouchableOpacity,
    BackHandler,
    FlatList,
} from 'react-native';
import * as NaverMap from '@mj-studio/react-native-naver-map';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import { lightColors, darkColors } from '../../styles';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useRouter } from 'expo-router';
import axios from "axios";
import { BASE_URL } from "../../BASE_URL";

export default function SearchScreen() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [region, setRegion] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showMap, setShowMap] = useState(true);
    const mapRef = useRef(null);
    const markerRefs = useRef([]);
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const colors = isDarkMode ? darkColors : lightColors;

    const handleBackPress = () => {
        setShowMap(false); // 1. 먼저 맵 제거
        setTimeout(() => {
            router.back();   // 2. 그 다음 pop
        }, 10);
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

    const geocodeRegion = async (province, city) => {
        try {
            const query = encodeURIComponent(`${province} ${city}`);
            const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'CoursePlateApp/1.0',
                    'Accept': 'application/json',
                },
            });
            const data = await response.json();
            if (data.length > 0) {
                const { lat, lon } = data[0];
                return {
                    latitude: parseFloat(lat),
                    longitude: parseFloat(lon),
                };
            }
        } catch (e) {
            console.error('Geocoding error:', e);
        }
        return { latitude: 37.5665, longitude: 126.9780 }; // default Seoul
    };

    const loadData = async (type = '전체') => {
        setLoading(true);

        const regionData = await AsyncStorage.getItem('selectedRegion');
        const userId = await AsyncStorage.getItem('userId');
        let coords = { latitude: 37.5665, longitude: 126.9780 };

        if (!regionData || !userId) {
            console.warn('❗ 지역정보 또는 userId가 없습니다.');
            setStores([]);
            setInitialLoading(false);
            setLoading(false);
            return;
        }

        const { province, city } = JSON.parse(regionData);
        const location = `${province} ${city}`;

        // 지도 위치 설정
        coords = await geocodeRegion(province, city);
        setRegion({ ...coords, latitudeDelta: 0.05, longitudeDelta: 0.05 });

        try {
            // 내부 커스텀 API 호출
            const response = await axios.get(
                `${BASE_URL}/api/naver/filtered/${userId}?location=${encodeURIComponent(location)}`
            );

            const filteredStores = response.data.items || [];
            const now = new Date().toISOString().split('T')[0];

            setStores(filteredStores);
            markerRefs.current = new Array(filteredStores.length);

            const newRecord = {
                id: Date.now().toString(),   // 고유 ID
                date: now,
                region: location,
            };

            const existing = await AsyncStorage.getItem('searchHistory');
            let history = existing ? JSON.parse(existing) : [];

            const isDuplicate = history.some(
                (item) => item.date === newRecord.date && item.region === newRecord.region
            );

            if (!isDuplicate) {
                history.unshift(newRecord); // 최신 기록 앞에 추가
                await AsyncStorage.setItem('searchHistory', JSON.stringify(history));
            }

            await AsyncStorage.setItem('cachedStores', JSON.stringify(filteredStores));
            await AsyncStorage.setItem('searchedAt', now);
            await AsyncStorage.setItem('searchedRegion', location);
        } catch (error) {
            console.error('❌ 필터링된 맛집 API 호출 실패:', error);
            setStores([]);
        }

        setInitialLoading(false);
        setLoading(false);
    };


    useEffect(() => {
        loadData();
    }, []);

    const handleStoreSelect = (store, index) => {
        setSelectedIndex(index);
        if (mapRef.current) {
            mapRef.current.animateCameraTo({
                latitude: parseFloat(store.mapy) / 1e7,
                longitude: parseFloat(store.mapx) / 1e7,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    };

    const goToDetail = (store) => {
        console.log('선택된 가게 좌표:', {
            mapx: store.mapx,
            mapy: store.mapy,
        });

        router.push({
            pathname: '/search/detail',
            params: {
                title: store.title,
                desc: store.description,
                address: store.address,
                tel: store.telephone,
                link: store.link,
                category: store.category,
                image: store.image || null,
                mapx: store.mapx, // ✅ 좌표 전달
                mapy: store.mapy,
            },
        });
    };


    if (initialLoading) {
        return <LoadingOverlay visible={true} color={colors.accent} message="데이터 로딩 중..." />;
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

            {/* 지도 + 리스트 */}
            <View style={{ flex: 1 }}>
                {/* 지도 */}
                <View style={{ flex: 0.6 }}>
                    {showMap &&
                        <NaverMap.NaverMapView
                            style={{ flex: 1 }}
                            region={region}
                            showsUserLocation
                            ref={mapRef}
                        >
                            {stores.map((store, index) => (
                                store.mapx && store.mapy && (
                                    <NaverMap.NaverMapMarkerOverlay
                                        key={index}
                                        latitude= {parseFloat(store.mapy) / 1e7}
                                        longitude= {parseFloat(store.mapx) / 1e7}
                                        pinColor={selectedIndex === index ? colors.accent : 'gray'}
                                    />
                                )
                            ))}
                        </NaverMap.NaverMapView>
                    }
                </View>

                {/* FlatList 리스트 */}
                {loading ? (
                    <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 20 }} />
                ) : (
                    <View style={{ flex: 0.4 }}>

                        <FlatList
                            data={stores}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
                            showsVerticalScrollIndicator
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    onPress={() => handleStoreSelect(item, index)}
                                    style={[
                                        styles.storeBox,
                                        {
                                            backgroundColor: colors.card,
                                            borderWidth: selectedIndex === index ? 2 : 0,
                                            borderColor: selectedIndex === index ? colors.accent : 'transparent',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            minHeight: 70,
                                            maxHeight: 90, // 높이 제한
                                            paddingVertical: 6,
                                            marginBottom: 8,
                                        },
                                    ]}

                                >
                                    <View style={{ flex: 1, paddingRight: 8 }}>
                                        <Text style={[styles.storeName, { color: colors.text, fontSize: 14 }]} numberOfLines={1}>
                                            {item.title.replace(/<[^>]+>/g, '')}
                                        </Text>
                                        <Text style={{ color: colors.text, fontSize: 12 }} numberOfLines={1}>{item.category}</Text>
                                        <Text style={{ color: colors.text, fontSize: 12 }} numberOfLines={1}>{item.description}</Text>
                                        <Text style={{ color: colors.text, fontSize: 10 }} numberOfLines={1}>{item.address}</Text>
                                    </View>

                                    {selectedIndex === index && (
                                        <TouchableOpacity
                                            onPress={() => goToDetail(item)}
                                            style={{
                                                width: 36,
                                                height: '100%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderLeftWidth: 1,
                                                borderLeftColor: colors.border,
                                            }}
                                        >
                                            <Text style={{ fontSize: 18, color: colors.accent }}>{'>'}</Text>
                                        </TouchableOpacity>
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    storeBox: {
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        backgroundColor: '#fff',
    },
    storeName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
});
