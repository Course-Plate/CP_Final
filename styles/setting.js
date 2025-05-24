import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        alignSelf: 'flex-start',
    },
    card: {
        width: '100%',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 18,
        fontWeight: '500',
    },
});
