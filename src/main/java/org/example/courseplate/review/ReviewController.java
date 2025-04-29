package org.example.courseplate.review;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> submitReview(@RequestBody Review review) {
        // ✅ 리뷰 저장 + AI 분석 + 결과 반영까지 Service에서 처리
        Review analyzedReview = reviewService.saveReviewWithAnalysis(review);

        return ResponseEntity.ok(analyzedReview);
    }
}
