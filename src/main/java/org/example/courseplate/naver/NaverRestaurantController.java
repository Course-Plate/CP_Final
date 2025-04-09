package org.example.courseplate.naver;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/naver")
@RequiredArgsConstructor
public class NaverRestaurantController {

    private final NaverLocalSearchService naverService;

    @PostMapping("/filtered")
    public ResponseEntity<String> fetchFilteredRestaurants(
            @RequestParam String location,
            @RequestBody KeywordFilterRequest filterRequest
    ) {
        String resultJson = naverService.searchAndFilter("맛집", location,
                filterRequest.getLikedKeywords(),
                filterRequest.getDislikedKeywords());
        return ResponseEntity.ok(resultJson);
    }
}
