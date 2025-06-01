package org.example.courseplate.place;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlaceServiceImpl implements PlaceService {

    private final PlaceRepository placeRepository;

    @Autowired
    public PlaceServiceImpl(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    // 장소 추가
    @Override
    public Place add(Place place) {
        return placeRepository.save(place);
    }

    // 장소 이름으로 주소 반환
    @Override
    public String getPlaceByPlaceName(String placeName) {
        Place place = placeRepository.findByPlaceName(placeName);
        return place != null ? place.getAddress() : null;
    }

    // 전체 장소 목록 반환
    @Override
    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    // placeId로 장소 정보 반환
    @Override
    public Place getPlaceByPlaceId(String placeId) {
        return placeRepository.findByPlaceId(placeId);
    }

    // ID로 장소 정보 수정
    @Override
    public Place updatePlace(String id, Place updatedPlace) {
        Optional<Place> optionalPlace = placeRepository.findById(id);
        if (optionalPlace.isPresent()) {
            Place place = optionalPlace.get();
            place.setPlaceName(updatedPlace.getPlaceName());
            place.setAddress(updatedPlace.getAddress());
            place.setExplain(updatedPlace.getExplain());
            place.setType(updatedPlace.getType());
            place.setLatitude(updatedPlace.getLatitude());
            place.setLongitude(updatedPlace.getLongitude());
            return placeRepository.save(place);
        }
        throw new IllegalArgumentException("Place not found with id: " + id);
    }

    // ID로 장소 삭제
    @Override
    public void deletePlace(String id) {
        placeRepository.deleteById(id);
    }
}
