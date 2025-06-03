package org.example.courseplate.survey;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.courseplate.naver.NaverLocalSearchService;
import org.example.courseplate.preference.PreferenceProfileService;
import org.example.courseplate.restaurant.Restaurant;
import org.example.courseplate.restaurant.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final PreferenceProfileService preferenceProfileService;
    private final RestaurantRepository restaurantRepo;
    private final NaverLocalSearchService naverLocalSearchService;

    // ✅ 사용자 설문 결과 기반 프로필 저장 (누적 저장)
    public void saveUserProfile(String userId, List<String> positive, List<String> negative) {
        preferenceProfileService.saveSurveyKeywords(userId, positive, negative);
    }

    // ✅ 설문 기반 추천 로직
    public List<Restaurant> recommendBasedOnSurvey(SurveyDto surveyDto) {
        // 1. 사용자 프로필 저장
        saveUserProfile(surveyDto.getUserId(), surveyDto.getPositiveKeywords(), surveyDto.getNegativeKeywords());

        // 2. 네이버 API 검색 (사용자 선택 지역 기반)
        String regionString = Optional.ofNullable(surveyDto.getRegion())
                .map(r -> r.getProvince() + " " + r.getCity())
                .orElse("서울"); // fallback

        String rawJson = naverLocalSearchService.searchRestaurants("맛집", regionString, 100);

        List<Restaurant> allResults = parseJsonToRestaurants(rawJson);

        // 3. 부정 키워드로 필터링
        List<String> negative = surveyDto.getNegativeKeywords();
        List<Restaurant> filteredResults = allResults.stream()
                .filter(r -> negative.stream().noneMatch(k -> r.getRestaurantName().contains(k)))
                .collect(Collectors.toList());

        return filteredResults;
    }


    // ✅ 네이버 API 응답 파싱
    private List<Restaurant> parseJsonToRestaurants(String json) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(json).get("items");

            List<Restaurant> list = new ArrayList<>();
            if (root != null) {
                for (JsonNode item : root) {
                    Restaurant r = new Restaurant();
                    r.setRestaurantName(item.get("title").asText().replaceAll("<.*?>", ""));
                    r.setAddress(item.get("address").asText());
                    r.setCategory(item.get("category").asText());
                    r.setKeywords(List.of(item.get("category").asText().split(", "))); // 카테고리로 키워드 설정
                    list.add(r);
                }
            }
            return list;
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }
}
