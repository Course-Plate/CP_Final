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
import { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET } from '@env';

const FOOD_TYPES = ['전체', '한식', '중식', '일식', '양식', '분식', '카페', '디저트', '패스트푸드'];

export default function SearchScreen() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('전체');
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

    const fetchStoresFromNaver = async (query) => {
        const encodedQuery = encodeURIComponent(query);
        const url = `https://openapi.naver.com/v1/search/local.json?query=${encodedQuery}&display=50&sort=comment`;

        try {
            const response = await fetch(url, {
                headers: {
                    'X-Naver-Client-Id': NAVER_CLIENT_ID, // 환경 변수 사용
                    'X-Naver-Client-Secret': NAVER_CLIENT_SECRET, // 환경 변수 사용
                },
            });

            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error('Naver API error:', error);
            return [];
        }
    };

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
        let keyword = '맛집';
        let coords = { latitude: 37.5665, longitude: 126.9780 };

        if (regionData) {
            const { province, city } = JSON.parse(regionData);
            keyword = `${province} ${city} ${type !== '전체' ? type : ''} 맛집`;
            coords = await geocodeRegion(province, city);
        }

        setRegion({ ...coords, latitudeDelta: 0.05, longitudeDelta: 0.05 });
        const result = await fetchStoresFromNaver(keyword);
        setStores(result);
        markerRefs.current = new Array(result.length);
        setLoading(false);
        setInitialLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleTypeSelect = (type) => {
        setSelectedType(type);
        loadData(type);
    };

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
            {/* 음식 필터 */}
            <View style={{ paddingHorizontal:15,paddingVertical: 15, marginBottom: 5 }}>
                <FlatList
                    data={FOOD_TYPES}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRow}
                    renderItem={({ item }) => (
                        <View style={{ marginHorizontal: 6 }}>
                            <Button
                                title={item}
                                onPress={() => handleTypeSelect(item)}
                                color={selectedType === item ? colors.accent : colors.border}
                            />
                        </View>
                    )}
                />

            </View>

            {/* 지도 + 리스트 */}
            <View style={{ flex: 1 }}>
                {/* 지도 */}
                <View style={{ height: 280 }}>
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
                    <FlatList
                        data={stores}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
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
