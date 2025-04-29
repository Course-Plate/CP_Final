package org.example.courseplate.survey;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.courseplate.naver.NaverLocalSearchService;
import org.example.courseplate.preference.PreferenceProfileService;
import org.example.courseplate.restaurant.Restaurant;
import org.example.courseplate.restaurant.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final PreferenceProfileService preferenceProfileService;
    private final RestaurantRepository restaurantRepo;
    private final NaverLocalSearchService naverLocalSearchService;

    // ✅ 사용자 설문 결과 기반 프로필 저장 (통합 구조에 저장)
    public void saveUserProfile(String userId, List<String> keywords) {
        List<String> atmospheres = keywords.stream()
                .filter(k -> k.contains("조용") || k.contains("단체") || k.contains("분위기"))
                .toList();

        List<String> categories = keywords.stream()
                .filter(k -> !atmospheres.contains(k))
                .toList();

        preferenceProfileService.saveSurveyKeywords(userId, categories, atmospheres);
    }

    // ✅ 설문 기반 추천 로직
    public List<Restaurant> recommendBasedOnSurvey(SurveyDto surveyDto) {
        // 1. 사용자 프로필 저장
        saveUserProfile(surveyDto.getUserId(), surveyDto.getPositiveKeywords());

        // 2. 네이버 API 검색
        String rawJson = naverLocalSearchService.searchRestaurants("맛집", "서울");
        List<Restaurant> allResults = parseJsonToRestaurants(rawJson);

        // 3. 부정 키워드로 필터링
        List<String> negative = surveyDto.getNegativeKeywords();
        List<Restaurant> filteredResults = allResults.stream()
                .filter(r -> negative.stream().noneMatch(k ->
                        r.getRestaurantName().contains(k) ||
                                r.getCategory().contains(k) ||
                                r.getAtmosphere().contains(k)))
                .collect(Collectors.toList());

        // 4. 결과 저장
        restaurantRepo.saveAll(filteredResults);

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
                    r.setPhone(item.has("telephone") ? item.get("telephone").asText() : "");
                    r.setCategory(item.get("category").asText());
                    r.setAtmosphere(""); // 기본값
                    r.setRating(0.0);    // 기본값
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
