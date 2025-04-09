package org.example.courseplate.survey;

import lombok.Data;
import java.util.List;

@Data
public class SurveyDto {
    private String userId;
    private List<String> positiveKeywords;
    private List<String> negativeKeywords;
}

