import { Stack, usePathname, useRouter } from 'expo-router';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { AppProviders } from "../context/AppContext";
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useEffect } from 'react';
import * as Location from 'expo-location';

function LayoutInner() {
    const pathname = usePathname();
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const hideHeaderLogo = pathname === '/login' || pathname === '/signup';
    const headerBgColor = isDarkMode ? '#1e1e1e' : '#fff';
    const course = isDarkMode ? '#f0f0f0' : '#fff';

    useEffect(() => {
        const requestLocationPermission = async () => {
            const { status } = await Location.getForegroundPermissionsAsync();
            if (status !== 'granted') {
                const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
                if (newStatus !== 'granted') {
                    Alert.alert(
                        '위치 권한 필요',
                        '정확한 기능 제공을 위해 위치 권한이 필요합니다.'
                    );
                }
            }
        };

        requestLocationPermission();
    }, []);

    return (
        <AppProviders>
            <Stack
                screenOptions={{
                    headerShown: !hideHeaderLogo,
                    headerLeft: () => null,
                    headerTitle: () =>
                        hideHeaderLogo ? null : (
                            <TouchableOpacity onPress={() => router.push('/home')}>
                                <Text style={styles.logo}>
                                    <Text style={styles.course}>Course</Text>
                                    <Text style={styles.plate}>Plate</Text>
                                </Text>
                            </TouchableOpacity>
                        ),
                    headerTitleAlign: 'left',
                    headerStyle: {
                        backgroundColor: headerBgColor, // ✅ 다크모드 반영
                    },
                    contentStyle: {
                        backgroundColor: headerBgColor, // ✅ 전환 중 배경색 적용
                    },
                    animation: 'fade', // ✨ 자연스러운 전환
                }}
            />
        </AppProviders>
    );
}

export default function Layout() {
    return (
        <ThemeProvider>
            <LayoutInner />
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    logo: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    course: {
        // 동적으로 색상 지정
    },
    plate: {
        color: '#F57C00',
    },
});
