package org.example.courseplate.place;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaceRepository extends MongoRepository<Place, String> {

    // 장소 이름으로 장소 검색
    Place findByPlaceName(String placeName);

    // 사용자 정의 장소 ID로 검색
    Place findByPlaceId(String placeId);
}
