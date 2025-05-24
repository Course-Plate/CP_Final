import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export default function LoadingOverlay({ visible, color = '#000', message = '로딩 중...' }) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <ActivityIndicator size="large" color={color} />
                {message && <Text style={styles.message}>{message}</Text>}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    message: {
        marginTop: 16,
        fontSize: 16,
        color: '#fff',
    },
});
