import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    Button,
    TouchableOpacity, BackHandler,
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

    const mapRef = useRef(null);
    const markerRefs = useRef([]);
    const router = useRouter();

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

    const { isDarkMode } = useTheme();
    const colors = isDarkMode ? darkColors : lightColors;

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

    const handleStorePress = (store, index) => {
        setSelectedIndex(index);
        if (mapRef.current) {
            mapRef.current.animateCameraTo({
                latitude: parseFloat(store.mapy) / 1e7,
                longitude: parseFloat(store.mapx) / 1e7,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
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
            },
        });
    };

    if (initialLoading) {
        return <LoadingOverlay visible={true} color={colors.accent} message="데이터 로딩 중..." />;
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={{ paddingVertical: 8, marginBottom: 4, backgroundColor: colors.background }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRow}
                >
                    {FOOD_TYPES.map((type) => (
                        <View key={type} style={{ marginHorizontal: 4 }}>
                            <Button
                                title={type}
                                onPress={() => handleTypeSelect(type)}
                                color={selectedType === type ? colors.accent : colors.border}
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>

            {region && (
                <View style={{ height: 280 }}>
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
                </View>
            )}

            {loading ? (
                <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 20 }} />
            ) : (
                <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.storeListContainer}>
                    {stores.map((store, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleStorePress(store, index)}
                            style={[styles.storeBox, {
                                backgroundColor: colors.card,
                                borderWidth: selectedIndex === index ? 2 : 0,
                                borderColor: selectedIndex === index ? colors.accent : 'transparent'
                            }]}
                        >
                            <Text style={[styles.storeName, { color: colors.text }]}> {store.title.replace(/<[^>]+>/g, '')} </Text>
                            <Text style={{ color: colors.text }}>{store.category}</Text>
                            <Text style={{ color: colors.text }}>{store.description}</Text>
                            <Text style={{ color: colors.text, fontSize: 12 }}>{store.address}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    storeListContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
        gap: 12,
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
