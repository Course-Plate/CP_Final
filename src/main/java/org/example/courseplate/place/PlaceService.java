package org.example.courseplate.place;

import java.util.List;

public interface PlaceService {

    // 장소 추가
    Place add(Place place);

    // 장소 이름으로 주소 가져오기
    String getPlaceByPlaceName(String placeName);

    // 전체 장소 목록 가져오기
    List<Place> getAllPlaces();

    // placeId로 장소 정보 가져오기
    Place getPlaceByPlaceId(String placeId);

    // 장소 정보 업데이트
    Place updatePlace(String id, Place updatedPlace);

    // 장소 삭제
    void deletePlace(String id);
}