package org.example.courseplate.review;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByPlaceId(String placeId);
    List<Review> findByUserId(String userId);
}
