package org.example.courseplate.api.survey;

import lombok.RequiredArgsConstructor;
import org.example.courseplate.api.survey.dto.SurveyDto;
import org.example.courseplate.domain.restaurant.Restaurant;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/survey")
@RequiredArgsConstructor
public class SurveyController {

    private final SurveyService surveyService;

    @PostMapping("/submit")
    public ResponseEntity<List<Restaurant>> submitSurvey(@RequestBody SurveyDto surveyDto) {
        List<Restaurant> result = surveyService.recommendBasedOnSurvey(surveyDto);
        return ResponseEntity.ok(result);
    }
}