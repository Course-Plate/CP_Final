package org.example.courseplate.domain.restaurant;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RestaurantRepository extends MongoRepository<Restaurant, String> {
    List<Restaurant> findByCategoryInAndAtmosphereIn(List<String> categories, List<String> atmospheres);
}
