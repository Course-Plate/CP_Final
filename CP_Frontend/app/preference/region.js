import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Alert, BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import BackButton from '../../components/BackButton';
import { common, region, lightColors, darkColors } from '../../styles';

const REGION_DATA = {
    '서울특별시': ['강남구', '강서구', '종로구', '마포구'],
    '경기도': ['수원시', '성남시', '고양시', '용인시', '의정부시', '파주시'],
    '강원도': ['춘천시', '원주시', '강릉시'],
    '부산광역시': ['해운대구', '서면', '남구'],
    '제주특별자치도': ['제주시', '서귀포시'],
};

export default function RegionScreen() {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const colors = isDarkMode ? darkColors : lightColors;

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [provinceExpanded, setProvinceExpanded] = useState(false);
    const [cityExpanded, setCityExpanded] = useState(false);

    const toggleProvince = () => setProvinceExpanded(!provinceExpanded);
    const toggleCity = () => setCityExpanded(!cityExpanded);

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

    const handleProvinceSelect = (province) => {
        setSelectedProvince(province);
        setSelectedCity(null);
        setCityExpanded(true);
        setProvinceExpanded(false);
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setCityExpanded(false);
    };

    const saveRegion = async () => {
        if (!selectedProvince || !selectedCity) {
            Alert.alert('지역 선택', '도와 시를 모두 선택해주세요.');
            return;
        }

        const region = {
            province: selectedProvince,
            city: selectedCity,
        };

        try {
            await AsyncStorage.setItem('selectedRegion', JSON.stringify(region));
            Alert.alert('저장 완료', `${selectedProvince} ${selectedCity} 저장됨`);
            router.replace('/home');
        } catch (e) {
            console.error('지역 저장 실패', e);
        }
    };

    return (
        <View style={[region.container, { backgroundColor: colors.background }]}>
            <BackButton
                label="뒤로가기"
                style={region.backButton}
                textStyle={{ color: colors.text }}
            />

            <Text style={[common.title, { color: colors.text }]}>여행 지역 선택</Text>

            {/* 도 선택 */}
            <TouchableOpacity
                onPress={toggleProvince}
                style={[region.dropdownButton, { backgroundColor: colors.card }]}
            >
                <Text style={{ color: colors.text }}>
                    {selectedProvince || '도 선택'}
                </Text>
            </TouchableOpacity>

            {provinceExpanded && (
                <FlatList
                    data={Object.keys(REGION_DATA)}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[region.listItem, { borderBottomColor: colors.border }]}
                            onPress={() => handleProvinceSelect(item)}
                        >
                            <Text style={{ color: colors.text }}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* 시 선택 */}
            {selectedProvince && (
                <>
                    <TouchableOpacity
                        onPress={toggleCity}
                        style={[region.dropdownButton, { backgroundColor: colors.card }]}
                    >
                        <Text style={{ color: colors.text }}>
                            {selectedCity || '시 선택'}
                        </Text>
                    </TouchableOpacity>

                    {cityExpanded && (
                        <FlatList
                            data={REGION_DATA[selectedProvince]}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[region.listItem, { borderBottomColor: colors.border }]}
                                    onPress={() => handleCitySelect(item)}
                                >
                                    <Text style={{ color: colors.text }}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </>
            )}

            {/* 완료 버튼 */}
            <TouchableOpacity
                style={[common.button, { backgroundColor: colors.accent, marginTop: 30 }]}
                onPress={saveRegion}
            >
                <Text style={common.buttonText}>선택 완료</Text>
            </TouchableOpacity>
        </View>
    );
}
