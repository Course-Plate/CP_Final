import React, {useState, useCallback, useEffect} from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity, BackHandler,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import { common, preference, lightColors, darkColors } from '../../styles';
import BackButton from '../../components/BackButton'; // ✅ 추가

export default function PreferenceScreen() {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const colors = isDarkMode ? darkColors : lightColors;

    const [selectedType, setSelectedType] = useState('');
    const [selectedAllergy, setSelectedAllergy] = useState([]);
    const [spicy, setSpicy] = useState('');
    const [temperature, setTemperature] = useState('');
    const [budget, setBudget] = useState('');

    const budgetOptions = ['10만원', '20만원', '30만원', '40만원'];

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

    useFocusEffect(
        useCallback(() => {
            const loadAllergy = async () => {
                const isSetAllergy = await AsyncStorage.getItem('isSetAllergy');
                if (isSetAllergy === 'Y') {
                    const stored = await AsyncStorage.getItem('allergy');
                    const parsed = stored ? JSON.parse(stored) : [];
                    setSelectedAllergy(parsed);
                }
            };
            loadAllergy();
        }, [])
    );

    const savePreferences = async () => {
        const preferences = {
            type: selectedType,
            allergy: selectedAllergy,
            spicy,
            temperature,
            budget,
        };
        await AsyncStorage.setItem('preferences', JSON.stringify(preferences));
        router.replace('/home');
    };

    const renderButton = (label, selected, onPress, key) => (
        <TouchableOpacity
            key={key}
            onPress={onPress}
            style={[
                preference.optionBtn,
                selected && preference.optionBtnSelected,
            ]}
        >
            <Text
                style={[
                    preference.optionText,
                    selected && preference.optionTextSelected,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView
            contentContainerStyle={[
                common.container,
                preference.container,
                { backgroundColor: colors.background },
            ]}
        >
            {/* ✅ 뒤로가기 버튼 */}
            <BackButton
                label="뒤로가기"
                style={{ alignSelf: 'flex-start', marginBottom: 10 }}
                textStyle={{ color: colors.text }}
            />

            <View style={[preference.card, { backgroundColor: colors.card }]}>
                {/* 선호 유형 */}
                <Text style={[preference.label, { color: colors.text }]}>선호 유형</Text>
                <View style={preference.optionRow}>
                    {['한식', '일식', '중식', '양식'].map((type) =>
                        renderButton(type, selectedType === type, () => setSelectedType(type), type)
                    )}
                </View>

                {/* 알러지 */}
                <Text style={[preference.label, { color: colors.text }]}>알레르기 성분</Text>
                <TouchableOpacity
                    onPress={() => router.push('/preference/allergy')}
                    style={[
                        preference.optionBtn,
                        preference.allergyButton,
                        selectedAllergy.length > 0 && preference.optionBtnSelected,
                    ]}
                >
                    <Text
                        style={[
                            preference.optionText,
                            selectedAllergy.length > 0 && preference.optionTextSelected,
                        ]}
                    >
                        {selectedAllergy.length > 0 ? '재선택' : '선택'}
                    </Text>
                </TouchableOpacity>

                {selectedAllergy.length > 0 && (
                    <View style={preference.allergyBox}>
                        {selectedAllergy.map((item) => (
                            <View key={item} style={preference.allergyTag}>
                                <Text style={{ color: '#fff' }}>{item}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* 매운맛 */}
                <Text style={[preference.label, { color: colors.text }]}>매운 맛</Text>
                <View style={preference.optionRow}>
                    {['선호', '비선호'].map((opt) =>
                        renderButton(opt, spicy === opt, () => setSpicy(opt), opt)
                    )}
                </View>

                {/* 온도 */}
                <Text style={[preference.label, { color: colors.text }]}>온도 선호</Text>
                <View style={preference.optionRow}>
                    {['HOT', 'COLD'].map((opt) =>
                        renderButton(opt, temperature === opt, () => setTemperature(opt), opt)
                    )}
                </View>

                {/* 예산 */}
                <Text style={[preference.label, { color: colors.text }]}>예산</Text>
                <View style={preference.optionRow}>
                    {budgetOptions.map((opt) =>
                        renderButton(opt, budget === opt, () => setBudget(opt), opt)
                    )}
                </View>

                {/* 완료 버튼 */}
                <TouchableOpacity style={preference.submitBtn} onPress={savePreferences}>
                    <Text style={preference.submitText}>설문 완료</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
