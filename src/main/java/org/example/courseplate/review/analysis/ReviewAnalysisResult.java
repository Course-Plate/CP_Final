package org.example.courseplate.review.analysis;

import lombok.Data;

import java.util.List;

@Data
public class ReviewAnalysisResult {
    private String sentiment;  // 긍정 / 부정 결과
    private List<String> positiveKeywords;  // 긍정 키워드 리스트
    private List<String> negativeKeywords;  // 부정 키워드 리스트
}
