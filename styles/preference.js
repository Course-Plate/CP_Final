import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        paddingTop: 40,
        paddingBottom: 80,
    },
    card: {
        width: '100%',
        borderRadius: 16,
        padding: 20,
        marginTop: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 6,
        fontSize: 15,
    },
    optionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    optionBtn: {
        minWidth: 80,
        textAlign: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F57C00',
        marginRight: 8,
        marginBottom: 8,
        alignItems: 'center',
    },
    optionBtnSelected: {
        backgroundColor: '#F57C00',
    },
    optionText: {
        color: '#F57C00',
        fontWeight: 'bold',
    },
    optionTextSelected: {
        color: '#fff',
    },
    submitBtn: {
        backgroundColor: '#F57C00',
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    }
    ,
    submitText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    allergyButton: {
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    allergyBox: {
        marginTop: 8,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    allergyTag: {
        backgroundColor: '#555',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
});
