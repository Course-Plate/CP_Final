package org.example.courseplate.api.review;

import lombok.RequiredArgsConstructor;
import org.example.courseplate.domain.review.Review;
import org.example.courseplate.domain.review.ReviewRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }
}
