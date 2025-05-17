// styles/common.js

import {Dimensions, StyleSheet} from 'react-native';

const { width, height } = Dimensions.get('window');     // 화면 크기 가져오기

export default StyleSheet.create({
    startContainer: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    MainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        position: 'absolute',
        top: height * 0.35,
        left: width * 0.1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        width: width * 0.8,
        height: height * 0.4,
        borderRadius: 20,
        elevation: 2
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    headerText1: {
        position: "absolute",
        bottom: 30,
        fontSize: 40,
        fontFamily: 'Candal',
        color: '#fff',
        marginLeft: 10,
    },
    headerText2: {
        position: "absolute",
        bottom: 0,
        fontSize: 16,
        fontFamily: 'Candal',
        color: '#fff',
        marginLeft: 10,
        marginBottom: 10,
    },
    section: {
        flex: 0.8,
        paddingTop: 25,
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#C3C3C3',
    },
    view: {
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 30,
        backgroundColor: '#fff',
    },
    input: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    button: {
        width: '100%',
        backgroundColor: '#F57C00',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    avatarCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
    },
    cardBox: {
        flex: 0.3,
        borderRadius: 12,
        marginHorizontal: 20,
        alignItems: 'center',
        minHeight: 230,
        justifyContent: 'center',
        paddingVertical: 24,
        paddingHorizontal: 16,
        minWidth: 80,
    },
    verifyText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    non_clicked: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#C3C3C3',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }
});
