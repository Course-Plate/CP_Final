package org.example.courseplate.api.review.analysis;

import lombok.extern.slf4j.Slf4j;
import org.example.courseplate.domain.review.Review;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
public class ReviewAnalysisClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.server.url}")
    private String aiServerUrl;

    public ReviewAnalysisResult analyzeReview(Review review) {
        try {
            return restTemplate.postForObject(
                    aiServerUrl + "/analyze",
                    review,
                    ReviewAnalysisResult.class
            );
        } catch (Exception e) {
            log.error("리뷰 분석 실패: {}", e.getMessage());
            return new ReviewAnalysisResult(); // 실패 시 빈 결과 반환
        }
    }
}
