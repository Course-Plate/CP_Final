package org.example.courseplate.api.review;

import lombok.RequiredArgsConstructor;
import org.example.courseplate.api.review.analysis.ReviewAnalysisClient;
import org.example.courseplate.api.review.analysis.ReviewAnalysisResult;
import org.example.courseplate.domain.review.Review;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewAnalysisClient analysisClient;

    @PostMapping
    public ResponseEntity<ReviewAnalysisResult> submitReview(@RequestBody Review review) {
        Review saved = reviewService.saveReview(review);
        ReviewAnalysisResult analysisResult = analysisClient.analyzeReview(saved);
        return ResponseEntity.ok(analysisResult);
    }
}
