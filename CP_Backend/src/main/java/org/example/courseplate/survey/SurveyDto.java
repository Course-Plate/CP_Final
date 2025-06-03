package org.example.courseplate.survey;

import lombok.Data;
import java.util.List;
import org.example.courseplate.survey.Region;

@Data
public class SurveyDto {
    private String userId;
    private List<String> positiveKeywords = List.of();
    private List<String> negativeKeywords = List.of();
    private Region region;
}


