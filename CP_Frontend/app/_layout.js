// app/_layout.js
import { Stack, usePathname, useRouter } from 'expo-router';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { AppProviders } from "../context/AppContext";
import { StatusBar } from "expo-status-bar";

function LayoutInner() {
    const pathname = usePathname();
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const hideHeaderLogo = pathname === '/login' || pathname === '/signup';
    const headerBgColor = isDarkMode ? '#1e1e1e' : '#fff';
    const course = isDarkMode ? '#f0f0f0' : '#fff';

    return (
        <AppProviders>
            <Stack
                screenOptions={{
                    headerShown: !hideHeaderLogo,
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
