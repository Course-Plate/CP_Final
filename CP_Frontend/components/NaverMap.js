import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
// import { NaverMapView, Marker } from '@mj-studio/react-native-naver-map';
import RNFS from 'react-native-fs';

const NaverMap = () => {
    const [geoJson, setGeoJson] = useState(null);
    const [isWebViewReady, setIsWebViewReady] = useState(false);
    const webViewRef = useRef(null);

    // GeoJSON 로드
    useEffect(() => {
        const loadGeoJson = async () => {
            try {
                const file = await RNFS.readFileAssets('TL_SCCO_CTPRVN.json');
                const parsedGeoJson = JSON.parse(file);
                console.log("📥 GeoJSON 로드 완료:", parsedGeoJson.features?.length, "개");
                setGeoJson(parsedGeoJson);
            } catch (e) {
                console.error('❌ GeoJSON 읽기 실패:', e);
            }
        };


        loadGeoJson();
    }, []);

    // WebView와 GeoJSON이 모두 준비되면 메시지 전송
    useEffect(() => {
        if (isWebViewReady && geoJson && webViewRef.current) {
            const geoJsonStr = JSON.stringify(geoJson);
            console.log('📤 WebView로 GeoJSON 전송:', geoJsonStr.length, 'bytes');
            webViewRef.current.postMessage(geoJsonStr);
        }
    }, [isWebViewReady, geoJson]);

    return (
        <View style={styles.container}>
            <WebView
                ref={webViewRef}
                originWhitelist={['*']}
                source={{ uri: 'file:///android_asset/naverMap.html' }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
                mixedContentMode="always"
                onLoadEnd={() => {
                    console.log("🌐 WebView 로드 완료");
                    setIsWebViewReady(true);
                }}
                onMessage={(event) => {
                    console.log("📍WebView 메시지:", event.nativeEvent.data);
                }}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('❌ WebView 에러 발생: ', nativeEvent);
                }}
                onHttpError={({ nativeEvent }) => {
                    console.warn('❌ HTTP 에러 발생: ', nativeEvent.statusCode);
                }}
                style={{ flex: 1 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default NaverMap;
