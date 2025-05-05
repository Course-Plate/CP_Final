package org.example.courseplate.place;

import java.util.List;

public interface PlaceService{
    Place add(Place place);
    String getPlaceByPlaceName(String placeName);
    List<Place> getAllPlaces();
    Place getPlaceByPlaceId(String placeId);
    Place updatePlace(String id, Place updatedPlace);
    void deletePlace(String id);
}
