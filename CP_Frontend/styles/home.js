import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    header: { flex: 0.5 },
    backgroundImage: { width: '100%', height: '100%' },

    topRow: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    nameText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },

    tabRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 16,
        gap: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#C3C3C3',
        paddingBottom: 25,
    },
    tabButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    tabActive: {
        backgroundColor: '#F57C00',
    },
    tabTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cardText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 12,
    },

    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        paddingVertical: 24,
    },
    bottomButton: {
        width: '40%',
        height: 80,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    bottomIcon: {
        width: 48,
        height: 48,
        resizeMode: 'contain',
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardEdit: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    cardSummary: {
        fontSize: 14,
        color: '#888',
    },

});
