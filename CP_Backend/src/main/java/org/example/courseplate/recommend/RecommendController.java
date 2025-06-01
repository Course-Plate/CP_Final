package org.example.courseplate.recommend;

import lombok.RequiredArgsConstructor;
import org.example.courseplate.restaurant.Restaurant;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommend")
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendService recommendService;

    /**
     * 사용자 ID를 기반으로 맞춤형 레스토랑 추천 제공
     *
     * @param userId 사용자 ID
     * @return 사용자 프로필 기반 맞춤형 레스토랑 목록
     */
    @GetMapping("/{userId}")
    public ResponseEntity<?> recommend(@PathVariable String userId) {
        try {
            List<Restaurant> recommendedRestaurants = recommendService.recommendByUserProfile(userId);
            if (recommendedRestaurants.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(recommendedRestaurants);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid user ID: " + userId);
        } catch (Exception e) {
            e.printStackTrace(); // 서버 로그에 에러 출력
            return ResponseEntity.status(500).body("An unexpected error occurred.");
        }
    }
}
