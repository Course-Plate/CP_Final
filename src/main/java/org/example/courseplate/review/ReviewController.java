package org.example.courseplate.review;

import lombok.RequiredArgsConstructor;
import org.example.courseplate.review.analysis.ReviewAnalysisClient;
import org.example.courseplate.review.analysis.ReviewAnalysisResult;
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
