package org.example.courseplate.api.survey;

import lombok.RequiredArgsConstructor;
import org.example.courseplate.api.survey.dto.SurveyDto;
import org.example.courseplate.domain.restaurant.Restaurant;
import org.example.courseplate.domain.restaurant.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final RestaurantRepository restaurantRepository;

    public List<Restaurant> recommendBasedOnSurvey(SurveyDto dto) {
        return restaurantRepository.findByCategoryInAndAtmosphereIn(
                dto.getFavoriteFoods(),
                dto.getAtmospherePreferences()
        );
    }
}