import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.6;

export default StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#00000066',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        zIndex: 100,
    },
    drawer: {
        width: DRAWER_WIDTH,
        height: '100%',
        paddingTop: 60,
        paddingHorizontal: 20,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    drawerItem: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 15, // ✅ 항목 사이 간격 추가
    },

    drawerItemText: {
        fontSize: 18, // ✅ 크기 확대
        fontWeight: '600',
        color: '#fff',
    },

    drawerTitle: {
        fontSize: 22, // ✅ 타이틀은 더 큼
        fontWeight: 'bold',
        marginBottom: 28,
        color: '#fff',
    },

    closeBtn: {
        marginTop: 40,
        backgroundColor: '#F57C00',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
