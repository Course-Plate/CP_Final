// app/index.js

import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.replace('/login');
        }, 500); // 약간의 지연

        return () => clearTimeout(timeout);
    }, []);

    return null;
}


/* 자동 로그인
useEffect(() => {
    const checkLogin = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            router.replace('/home');
        } else {
            router.replace('/login');
        }
    };
    checkLogin();
}, []);
*/