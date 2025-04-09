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

    @GetMapping("/{userId}")
    public ResponseEntity<List<Restaurant>> recommend(@PathVariable String userId) {
        List<Restaurant> result = recommendService.recommendByUserProfile(userId);
        return ResponseEntity.ok(result);
    }
}