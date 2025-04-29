package org.example.courseplate.review;

import lombok.RequiredArgsConstructor;
import org.example.courseplate.preference.PreferenceProfileService;
import org.example.courseplate.review.analysis.ReviewAnalysisClient;
import org.example.courseplate.review.analysis.ReviewAnalysisResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewAnalysisClient reviewAnalysisClient;
    private final PreferenceProfileService preferenceProfileService;

    public Review saveReviewWithAnalysis(Review review) {
        // 1. 리뷰 저장 (원본 내용만 저장)
        Review savedReview = reviewRepository.save(review);

        // 2. AI 서버에 리뷰 분석 요청
        ReviewAnalysisResult result = reviewAnalysisClient.analyzeReview(savedReview);

        // 3. 분석 결과를 리뷰에 추가
        savedReview.setSentiment(result.getSentiment());

        // 긍정 키워드 + 부정 키워드 합쳐서 저장
        List<String> combinedKeywords = new ArrayList<>();
        if (result.getPositiveKeywords() != null) combinedKeywords.addAll(result.getPositiveKeywords());
        if (result.getNegativeKeywords() != null) combinedKeywords.addAll(result.getNegativeKeywords());
        savedReview.setKeywords(combinedKeywords);

        // 4. 리뷰 업데이트 저장
        Review updatedReview = reviewRepository.save(savedReview);

        // 5. 사용자 PreferenceProfile에 키워드 누적 저장
        preferenceProfileService.appendReviewKeywords(
                review.getUserId(),
                result.getPositiveKeywords(),
                result.getNegativeKeywords()
        );

        return updatedReview;
    }
}
