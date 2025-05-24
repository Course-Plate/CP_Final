import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker'; // ✅ 변경
import { useTheme } from '../../context/ThemeContext';
import { lightColors, darkColors } from '../../styles';
import { useRouter } from 'expo-router';

export default function ReviewScreen() {
    const [store, setStore] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [imageUri, setImageUri] = useState(null);
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const colors = isDarkMode ? darkColors : lightColors;

    useEffect(() => {
        const loadStore = async () => {
            const data = await AsyncStorage.getItem('review_eligible');
            if (data) {
                const parsed = JSON.parse(data);
                setStore(parsed);
            } else {
                Alert.alert('리뷰 불가', '리뷰 가능한 가게 정보가 없습니다.');
                router.back();
            }
        };
        loadStore();
    }, []);

    const handlePickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
        });

        if (result.didCancel || !result.assets || result.assets.length === 0) return;

        setImageUri(result.assets[0].uri);
    };

    const handleSubmit = async () => {
        if (!reviewText.trim() || rating === 0) {
            Alert.alert('입력 오류', '별점과 리뷰를 모두 작성해주세요.');
            return;
        }

        // 저장 로직은 서버 또는 로컬 DB에 연결
        console.log('📦 제출됨:', { store, reviewText, rating, imageUri });

        await AsyncStorage.removeItem('review_eligible');
        Alert.alert('감사합니다!', '리뷰가 저장되었습니다.');
        router.replace('/home');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {store && (
                <>
                    <Text style={[styles.storeName, { color: colors.text }]}>
                        {store.title}
                    </Text>

                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <TouchableOpacity key={num} onPress={() => setRating(num)}>
                                <Text style={{ fontSize: 32, color: num <= rating ? '#F5B301' : '#CCC' }}>★</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput
                        style={[styles.textInput, { color: colors.text, borderColor: colors.border }]}
                        placeholder="리뷰 내용을 입력하세요..."
                        placeholderTextColor={colors.placeholder}
                        multiline
                        value={reviewText}
                        onChangeText={setReviewText}
                    />

                    {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

                    <TouchableOpacity
                        onPress={handlePickImage}
                        style={[styles.button, { backgroundColor: colors.border }]}
                    >
                        <Text style={{ color: colors.text }}>🖼 사진 추가</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={[styles.button, { backgroundColor: colors.accent }]}
                    >
                        <Text style={{ color: '#fff' }}>✅ 리뷰 등록</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    storeName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    starsRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        minHeight: 100,
        marginBottom: 12,
    },
    preview: {
        width: '100%',
        height: 200,
        marginBottom: 12,
        borderRadius: 8,
    },
    button: {
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
});
