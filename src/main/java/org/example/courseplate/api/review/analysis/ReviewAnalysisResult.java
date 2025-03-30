
package org.example.courseplate.api.review.analysis;

import lombok.Data;

import java.util.List;

@Data
public class ReviewAnalysisResult {
    private String sentiment;
    private List<String> keywords;
}
