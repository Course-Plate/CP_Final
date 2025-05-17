import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 32,
    },
    tagWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F57C00',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    removeBtn: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 6,
    },
    completeBtn: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    completeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    fixedBottom: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
});
