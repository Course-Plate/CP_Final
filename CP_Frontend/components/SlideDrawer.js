// components/SlideDrawer.js
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';

import drawer from '../styles/drawer'; // ✅ drawer 스타일 임포트

import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.6;

export default function SlideDrawer({ visible, onClose, children, backgroundColor = '#fff' }) {
    const translateX = useSharedValue(DRAWER_WIDTH);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (visible) {
            setShouldRender(true);
            translateX.value = withTiming(0, { duration: 300 });
        } else {
            translateX.value = withTiming(DRAWER_WIDTH, { duration: 300 }, (finished) => {
                if (finished) {
                    runOnJS(setShouldRender)(false);
                }
            });
        }
    }, [visible]);

    const drawerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    if (!shouldRender) return null;

    return (
        <Pressable style={drawer.overlay} onPress={onClose}>
            <Animated.View style={[drawer.drawer, drawerStyle, { backgroundColor }]}>
                <Pressable onPress={() => {}}>
                    {children}
                    <Pressable onPress={onClose} style={drawer.closeBtn}>
                        <Text style={drawer.closeText}>닫기</Text>
                    </Pressable>
                </Pressable>
            </Animated.View>
        </Pressable>
    );

}
