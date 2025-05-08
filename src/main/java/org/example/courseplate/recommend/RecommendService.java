package org.example.courseplate.recommend;

import lombok.RequiredArgsConstructor;
import org.example.courseplate.preference.PreferenceProfile;
import org.example.courseplate.preference.PreferenceProfileRepository;
import org.example.courseplate.restaurant.Restaurant;
import org.example.courseplate.restaurant.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendService {

    private final RestaurantRepository restaurantRepository;
    private final PreferenceProfileRepository preferenceRepo;

    /**
     * 사용자 프로필 기반 맞춤형 레스토랑 추천
     * @param userId 사용자 ID
     * @return 사용자 선호/비선호 키워드를 반영한 레스토랑 목록
     */
    public List<Restaurant> recommendByUserProfile(String userId) {
        PreferenceProfile profile = preferenceRepo.findByUserId(userId);
        if (profile == null) {
            return List.of(); // 사용자가 존재하지 않으면 빈 리스트 반환
        }

        // 사용자 선호 및 비선호 키워드 수집
        Set<String> preferred = profile.getSurvey() != null ?
                new HashSet<>(profile.getSurvey().getLikeKeywords()) : Set.of();
        Set<String> nonPreferred = profile.getSurvey() != null ?
                new HashSet<>(profile.getSurvey().getDislikeKeywords()) : Set.of();

        if (profile.getReview() != null) {
            preferred.addAll(profile.getReview().getPositiveKeywords());
            nonPreferred.addAll(profile.getReview().getNegativeKeywords());
        }

        // MongoDB에서 키워드를 기반으로 필터링된 레스토랑 조회
        List<Restaurant> filteredRestaurants = restaurantRepository.findByKeywordsIn(preferred)
                .stream()
                .filter(r -> r.getKeywords().stream().noneMatch(nonPreferred::contains))
                .collect(Collectors.toList());

        return filteredRestaurants;
    }
}
