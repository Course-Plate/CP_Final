package org.example.courseplate.review;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 리뷰 생성
    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        Review createdReview = reviewService.createReview(review);
        return ResponseEntity.ok(createdReview);
    }

    // 리뷰 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable String id) {
        Review review = reviewService.getReviewById(id);
        return ResponseEntity.ok(review);
    }

    // 장소별 리뷰 조회
    @GetMapping("/place/{placeId}")
    public ResponseEntity<List<Review>> getReviewsByPlaceId(@PathVariable String placeId) {
        List<Review> reviews = reviewService.getReviewsByPlaceId(placeId);
        return ResponseEntity.ok(reviews);
    }

    // 사용자별 리뷰 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUserId(@PathVariable String userId) {
        List<Review> reviews = reviewService.getReviewsByUserId(userId);
        return ResponseEntity.ok(reviews);
    }

    // 리뷰 수정
    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable String id, @RequestBody Review updatedReview) {
        Review review = reviewService.updateReview(id, updatedReview);
        return ResponseEntity.ok(review);
    }

    // 리뷰 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
