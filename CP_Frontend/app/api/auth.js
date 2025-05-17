import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://<백엔드주소>'; // 실제 백엔드 주소로 바꿔줘!

export const login = async (phone, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            phone,
            password,
        });

        const { token, name } = response.data;

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userName', name);

        return { success: true, name };
    } catch (error) {
        return { success: false, message: error.response?.data || '로그인 실패' };
    }
};

export const signup = async ({ name, phone, password }) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/signup`, {
            name,
            phone,
            password,
        });

        return { success: true };
    } catch (error) {
        return { success: false, message: error.response?.data || '회원가입 실패' };
    }
};
