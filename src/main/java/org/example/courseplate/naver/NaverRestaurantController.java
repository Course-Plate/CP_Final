package org.example.courseplate.naver;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/naver")
@RequiredArgsConstructor
public class NaverRestaurantController {

    private final NaverLocalSearchService naverService;

    @GetMapping("/filtered")
    public ResponseEntity<String> fetchFilteredRestaurantsByUser(
            @RequestParam String location,
            @RequestParam String userId
    ) {
        String resultJson = naverService.searchAndFilterByUserProfile("맛집", location, userId);
        return ResponseEntity.ok(resultJson);
    }
}
