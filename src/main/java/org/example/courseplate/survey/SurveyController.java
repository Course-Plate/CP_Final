package org.example.courseplate.survey;

import lombok.RequiredArgsConstructor;
import org.example.courseplate.restaurant.Restaurant;
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
        System.out.println("📨 설문 요청 수신: " + surveyDto);
        List<Restaurant> result = surveyService.recommendBasedOnSurvey(surveyDto); // ✅ 정상 작동
        return ResponseEntity.ok(result);
    }


}

