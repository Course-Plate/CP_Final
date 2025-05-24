import React, { useState, useMemo, useRef, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    Dimensions,
    TextInput,
    Image,
    PermissionsAndroid,
    Platform
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTheme } from '../../../context/ThemeContext';
import { useFont } from "../../../context/FontContext";
import * as NaverMap from '@mj-studio/react-native-naver-map';
import { common, lightColors, darkColors, home } from '../../../styles';
import { PlacesContext } from '../../../context/PlacesContext';

const { width, height } = Dimensions.get('window');

export default function HistoryDetailScreen() {
    const { id } = useLocalSearchParams();
    const { isDarkMode } = useTheme();
    const { fontsLoaded } = useFont();
    const [selectedPlace, setSelectedPlace] = useState(null);
    const mapRef = useRef(null);
    const { places } = useContext(PlacesContext);
    const colors = isDarkMode ? darkColors : lightColors;
    const [reviewVisible, setReviewVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewContent, setReviewContent] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);

    if (!fontsLoaded) {
        return null; // 폰트가 로드될 때까지 아무것도 렌더링하지 않음
    }

    // 중심 마커 계산
    const centerMarker = useMemo(() => {
        const centerPoint = {
            lat: places.reduce((sum, p) => sum + p.lat, 0) / places.length,
            lng: places.reduce((sum, p) => sum + p.lng, 0) / places.length,
        };

        const getDistance = (a, b) => {
            const dLat = a.lat - b.lat;
            const dLng = a.lng - b.lng;
            return Math.sqrt(dLat * dLat + dLng * dLng);
        };

        return places.reduce((closest, current) => {
            const currentDist = getDistance(current, centerPoint);
            const closestDist = getDistance(closest, centerPoint);
            return currentDist < closestDist ? current : closest;
        });
    }, []);

    //  지도 초기화 후에 지연을 두고 카메라 이동
    useEffect(() => {
        if (!mapRef.current) return;
        // 500ms 정도 지연을 줘야 native view가 완전히 준비됩니다.
        const id = setTimeout(() => {
            mapRef.current.animateCameraTo({
                lat: centerMarker.lat,
                lng: centerMarker.lng,
                zoom: 18,
            });
        }, 500);
        return () => clearTimeout(id);
    }, [centerMarker]);

    // 별점 그리기
    const renderStars = () => {
        return [1,2,3,4,5].map(i => (
            <TouchableOpacity key={i} onPress={() => setRating(i)}>
                <Text style={{ fontSize: 60, color: i <= rating ? '#F57C00' : '#E0E0E0' }}>★</Text>
            </TouchableOpacity>
        ));
    };


    // 이미지 선택 함수
    const pickImages = async () => {
        const hasPerm = await requestGalleryPermission();
        if (!hasPerm) {
            alert('갤러리 접근 권한이 필요합니다.');
            return;
        }

        launchImageLibrary(
            {
                mediaType: 'photo',
                selectionLimit: 0,       // 0 = unlimited (여러 장 선택 허용)
                includeBase64: false,
            },
            (response) => {
                if (response.didCancel) return;
                if (response.errorCode) {
                    console.warn(response.errorMessage);
                    return;
                }
                if (response.assets) {
                    // URI 리스트만 저장
                    setSelectedImages(response.assets.map(asset => asset.uri));
                }
            }
        );
    };

    // 이미지 삭제 함수
    const removeImage = (index) => {
        setSelectedImages((images) =>
            images.filter((_, i) => i !== index)
        );
    };

    // 갤러리 접근권한
    const requestGalleryPermission = async () => {
        if (Platform.OS !== 'android') return true;

        if (Platform.Version >= 33) {
            // Android 13 이상
            const status = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                {
                    title: '이미지 접근 권한',
                    message: '앱에서 사진을 불러오려면 권한이 필요합니다.',
                    buttonPositive: '확인',
                    buttonNegative: '취소',
                }
            );
            return status === PermissionsAndroid.RESULTS.GRANTED;
        } else {
            // Android 12 이하
            const statuses = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ]);
            return (
                statuses['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
            );
        }
    };



    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Stack.Screen options={{ title: `코스 상세 ${id}` }} />

            {/* 네이버 지도 */}
            <NaverMap.NaverMapView
                style={{ flex: 1 }}
                initialCamera={{
                    latitude: centerMarker.lat,
                    longitude: centerMarker.lng,
                    zoom: 15,
                }}
            >
                {places.map((place) => (
                    <NaverMap.NaverMapMarkerOverlay
                        key={place.id}
                        latitude={place.lat}      // 반드시 latitude, longitude 사용 :contentReference[oaicite:1]{index=1}
                        longitude={place.lng}
                        image={{ symbol: 'green' }}
                        onTap={() => setSelectedPlace(place)}  // 이벤트명도 onTap 으로 :contentReference[oaicite:2]{index=2}
                    />
                ))}
            </NaverMap.NaverMapView>

            {/* 음식점 정보 카드 리스트 */}
            <ScrollView style={{ padding: 10, maxHeight: 220 }}>
                {places.map((place) => (
                    <View key={place.id} style={[common.cardBox, {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: colors.card,
                        paddingVertical: 20,
                        minHeight: 0,
                        marginBottom: 10,
                    }]}>
                        <Text style={{ color: colors.text }}>{place.type}: {place.name}</Text>
                        <TouchableOpacity onPress={() => setSelectedPlace(place)}>
                            <Text style={[home.tabButton, { color: colors.text, backgroundColor: '#F57C00', paddingVertical: 10 }]}>음식점 정보</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* 음식점 정보 모달 */}
            {selectedPlace && (
                <Modal visible={true} transparent animationType="slide">
                    <View style={[common.modal, { justifyContent: 'flex-start', top: height * 0.1, height: height * 0.85 }]}>
                        <Text style={{ fontSize: 30, marginTop: 10, fontFamily: 'Jua' }}>{selectedPlace.name}</Text>
                        <Text style={{ marginTop: 5, marginBottom: 5 }}>{selectedPlace.roadAddress}</Text>
                        <Text>{selectedPlace.telephone}</Text>
                        <Text style={{
                            width: '100%',
                            minHeight: 80,
                            textAlign: 'center',
                            margin: 10,
                            borderStyle: 'dotted',
                            borderBottomWidth: 0.5
                        }}>{selectedPlace.description}</Text>

                        <ScrollView style={{
                            width: '100%',
                            padding: 10,
                            maxHeight: 500,
                        }}>

                            {/* 리뷰 최신순 정렬 */}
                            {[...selectedPlace.review].reverse().map(r => (
                                <View key={r.id} style={{ marginBottom: 12 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ flex: 0.5, fontFamily: 'Jua', fontSize: 18 }}>{`메뉴: ${r.menu}`}</Text>
                                        <Text style={{ flex: 0.5, fontFamily: 'Jua', fontSize: 18 }}>{`작성자: ${r.userId}`}</Text>
                                    </View>
                                    <Text style={{ fontSize: 12, marginTop: 2 }}>{r.date}</Text>
                                    <Text style={{ marginTop: 4 }}>{r.content}</Text>
                                </View>
                            ))}

                        </ScrollView>

                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', position: 'absolute', bottom: 15 }}>
                            <TouchableOpacity onPress={() => setReviewVisible(true)}>
                                <Text style={{ fontSize: 27 }}>리뷰 쓰기</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setSelectedPlace(null)}>
                                <Text style={{ fontSize: 27 }}>닫기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

            {/* 리뷰 작성 모달 */}
            {reviewVisible && (
                <Modal visible transparent animationType="slide">
                    <View style={[common.modal, { justifyContent:'flex-start', top: height * 0.05, height: height * 0.9, padding:20 }]}>
                        <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
                            <Text style={{ fontSize:20, fontWeight:'bold' }}>리뷰 작성</Text>
                        </View>
                        {/* 사진 영역 */}
                        <View style={{ flexDirection:'row', alignItems:'center', marginVertical:15 }}>
                            {selectedImages.length > 0 ? (
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    {selectedImages.map((uri, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            onPress={() => removeImage(idx)}
                                            style={{ marginRight: 5, marginBottom: 5 }}
                                        >
                                            <Image
                                                source={{ uri }}
                                                style={{ width: 80, height: 80, borderRadius: 8 }}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            ) : (
                                <View style={{
                                    width: 80,
                                    height: 80,
                                    backgroundColor: '#e0e0e0',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Text>사진</Text>
                                </View>
                            )}
                        </View>
                            <TouchableOpacity style={{ marginLeft:10 }} onPress={pickImages}>
                                <Text style={{ fontSize:16 }}>+ 사진 추가</Text>
                            </TouchableOpacity>
                        {/* 별점 */}
                        <View style={{ flexDirection:'row', marginVertical:10 }}>
                            {renderStars()}
                        </View>
                        {/* 상세 리뷰 입력 */}
                        <Text style={{ marginVertical:10 }}>상세 리뷰를 작성해주세요</Text>
                        <TextInput
                            style={{ width: '100%', height: 200, borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, textAlignVertical:'top' }}
                            multiline
                            value={reviewContent}
                            onChangeText={setReviewContent}
                            placeholder="리뷰 입력"
                        />

                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', position: 'absolute', bottom: 15 }}>
                            {/* 작성 버튼 */}
                            <TouchableOpacity
                                style={{ padding: 20, marginTop:20, backgroundColor:'#F57C00', paddingVertical:12, borderRadius:8, alignItems:'center' }}
                                onPress={() => {
                                    // TODO: 리뷰 저장 로직
                                    setReviewVisible(false);
                                }}
                            >
                                <Text style={{ color:'#fff', fontSize:16 }}>작성</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ padding: 20, marginTop:20, backgroundColor:'#F57C00', paddingVertical:12, borderRadius:8, alignItems:'center' }}
                                onPress={() => setReviewVisible(false)}>
                                <Text style={{ color:'#fff', fontSize:16 }}>닫기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}
