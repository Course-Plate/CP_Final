// components/PrimaryButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import common from '../styles/common';

export default function PrimaryButton({ onPress, title, disabled = false, style }) {
    return (
        <TouchableOpacity
            style={[
                common.button,
                disabled && styles.disabledButton,
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text
                style={[
                    common.buttonText,
                    disabled && styles.disabledText,
                ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    disabledButton: {
        backgroundColor: '#ccc',
    },
    disabledText: {
        color: '#666',
    },
});
