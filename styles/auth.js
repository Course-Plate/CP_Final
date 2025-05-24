import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    logoCard: {
        padding: 24,
        borderRadius: 16,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        gap: 8,
    },
    verifyButton: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 16,
        minWidth: 80,
    },
    verifyText: {
        color: '#fff',
        fontWeight: 'bold',
    },

});
