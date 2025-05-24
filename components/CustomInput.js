import React from 'react';
import { TextInput } from 'react-native';
import common from '../styles/common';

export default function CustomInput({
                                        style,
                                        backgroundColor,
                                        color,
                                        borderColor = '#ccc', // ✅ 기본값 지정
                                        placeholderTextColor = '#888',
                                        ...props
                                    }) {
    return (
        <TextInput
            style={[
                common.input,
                {
                    backgroundColor,
                    color,
                    borderColor,
                    borderWidth: 1,
                },
                style,
            ]}
            placeholderTextColor={placeholderTextColor}
            {...props}
        />
    );
}
