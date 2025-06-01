package org.example.courseplate.naver;

import lombok.RequiredArgsConstructor;
import org.example.courseplate.preference.PreferenceProfile;
import org.example.courseplate.preference.PreferenceProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/naver")
@RequiredArgsConstructor
public class NaverRestaurantController {

    private final NaverLocalSearchService naverService;
    private final PreferenceProfileRepository preferenceRepo;

    /**
     * 사용자 ID로 키워드를 자동으로 불러와서 맛집 필터링
     * @param userId 사용자 ID
     * @param location 위치 (예: 서울)
     * @return 필터링된 맛집 목록
     */
    @GetMapping("/filtered/{userId}")
    public ResponseEntity<String> fetchFilteredRestaurants(
            @PathVariable String userId,
            @RequestParam String location
    ) {
        // 사용자 프로필에서 선호/비선호 키워드 자동 불러오기
        PreferenceProfile profile = preferenceRepo.findByUserId(userId);

        if (profile == null) {
            return ResponseEntity.badRequest().body("{\"error\": \"사용자 프로필을 찾을 수 없습니다.\"}");
        }

        // 선호 키워드와 비선호 키워드 설정
        List<String> likedKeywords = profile.getSurvey().getLikeKeywords();
        List<String> dislikedKeywords = profile.getSurvey().getDislikeKeywords();

        // 네이버 API 호출 및 필터링
        String resultJson = naverService.searchAndFilterByUserProfile("맛집", location, userId);
        return ResponseEntity.ok(resultJson);
    }
}
