import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    BackHandler,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import { common, allergy, lightColors, darkColors } from '../../styles';

const ALLERGY_OPTIONS = [
    '우유', '계란', '땅콩', '대두(콩)', '견과류', '밀', '감귤류',
    '복숭아', '토마토', '조개류', '생선', '소고기', '돼지고기',
    '닭고기', '갑각류', '메밀', '잔탄검'
];

export default function AllergyScreen() {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const colors = isDarkMode ? darkColors : lightColors;

    const [selected, setSelected] = useState([]);

    const toggleSelect = (item) => {
        setSelected((prev) => {
            // 배열이 이전 상태를 기반으로 새로운 상태를 반환하도록 함
            if (prev.includes(item)) {
                return prev.filter((i) => i !== item); // 이미 선택된 항목이면 삭제
            } else {
                return [...prev, item]; // 선택되지 않은 항목이면 추가
            }
        });
    };

    const removeTag = (item) => {
        setSelected((prev) => prev.filter((i) => i !== item));
    };

    const saveSelection = async () => {
        try {
            await AsyncStorage.removeItem('allergy'); // 기존 알레르기 항목 삭제
            await AsyncStorage.setItem('allergy', JSON.stringify(selected)); // 새로운 알레르기 항목 저장
            await AsyncStorage.setItem('isSetAllergy', 'Y');
            router.back();
        } catch (error) {
            console.error('Error saving allergy selection:', error);
        }
    };

    const renderItem = ({ item }) => {
        const isSelected = selected.includes(item);
        return (
            <TouchableOpacity onPress={() => toggleSelect(item)}>
                <View
                    style={{
                        paddingVertical: 14,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.divider,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            color: isSelected ? colors.accent : colors.text,
                            fontWeight: isSelected ? 'bold' : 'normal',
                        }}
                    >
                        {item}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[allergy.container, { backgroundColor: colors.background }]}>
            <Text style={[common.title, { color: colors.text, textAlign: 'center' }]}>
                알레르기 성분 선택
            </Text>

            {selected.length > 0 && (
                <View style={allergy.tagWrap}>
                    {selected.map((item) => (
                        <View key={item} style={allergy.tag}>
                            <Text style={allergy.tagText}>{item}</Text>
                            <TouchableOpacity onPress={() => removeTag(item)}>
                                <Text style={allergy.removeBtn}> ✕ </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            <FlatList
                removeClippedSubviews={false}
                data={ALLERGY_OPTIONS}
                keyExtractor={(item) => item} // 고유한 key 제공
                renderItem={renderItem}
                contentContainerStyle={{ paddingTop: 24, paddingBottom: 80 }}
            />

            <View style={allergy.fixedBottom}>
                <TouchableOpacity
                    style={[allergy.completeBtn, { backgroundColor: colors.accent }]}
                    onPress={saveSelection}
                >
                    <Text style={allergy.completeText}>선택 완료</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
