package org.example.courseplate.place;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaceRepository extends MongoRepository<Place, String> {
    Place findByPlaceName(String placeName);
    Place findByPlaceId(String placeId);
}
