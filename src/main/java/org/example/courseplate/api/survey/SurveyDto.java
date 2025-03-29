package org.example.courseplate.api.survey.dto;

import lombok.Data;
import java.util.List;

@Data
public class SurveyDto {
    private List<String> favoriteFoods;
    private List<String> atmospherePreferences;
    private List<String> pricePreferences;
}
