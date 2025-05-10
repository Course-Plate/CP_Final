package org.example.courseplate.review;

import java.util.List;

public interface ReviewService {
    Review createReview(Review review);
    Review updateReview(String id, Review updatedReview);
    void deleteReview(String id);
    Review getReviewById(String id);
    List<Review> getReviewsByPlaceId(String placeId);
    List<Review> getReviewsByUserId(String userId);
}
