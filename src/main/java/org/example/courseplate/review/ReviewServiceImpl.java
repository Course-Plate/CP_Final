package org.example.courseplate.review;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    //리뷰 작성
    @Override
    public Review createReview(Review review) {
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

        //리뷰 수정(점수, 리뷰내용 , 사진만 수정 가능)
        @Override
        public Review updateReview(String id, Review updatedReview) {
            Optional<Review> optionalReview = reviewRepository.findById(id);

            if (optionalReview.isPresent()) {
                Review review = optionalReview.get();
                review.setScore(updatedReview.getScore());
                review.setReviewContent(updatedReview.getReviewContent());
                review.setBossContent(updatedReview.getBossContent());
                review.setReviewImg(updatedReview.getReviewImg());
                review.setCreatedAt(LocalDateTime.now());
                review.setUpdatedAt(LocalDateTime.now());
                return reviewRepository.save(review);
            } else {
                throw new IllegalArgumentException("리뷰를 찾을 수 없습니다. ID: " + id);
            }
        }

    //리뷰 삭제
    @Override
    public void deleteReview(String id) {
        if (!reviewRepository.existsById(id)) {
            throw new IllegalArgumentException("리뷰를 찾을 수 없습니다. ID: " + id);
        }
        reviewRepository.deleteById(id);
    }

    //리뷰 찾기(id)
    @Override
    public Review getReviewById(String id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다. ID: " + id));
    }

    //리뷰 보기(placeId)
    @Override
    public List<Review> getReviewsByPlaceId(String placeId) {
        return reviewRepository.findByPlaceId(placeId);
    }

    //리뷰 보기(userId)
    @Override
    public List<Review> getReviewsByUserId(String userId) {
        return reviewRepository.findByUserId(userId);
    }
}
