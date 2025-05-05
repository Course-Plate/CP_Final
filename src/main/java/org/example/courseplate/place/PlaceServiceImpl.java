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

    @Override
    public Place add(Place place) {
        return placeRepository.save(place);
    }

    @Override
    public String getPlaceByPlaceName(String placeName) {
        Place place = placeRepository.findByPlaceName(placeName);
        return place != null ? place.getAddress() : null;
    }

    @Override
    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    @Override
    public Place getPlaceByPlaceId(String placeId) {
        return placeRepository.findByPlaceId(placeId);
    }

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

    @Override
    public void deletePlace(String id) {
        placeRepository.deleteById(id);
    }
}
