package org.example.courseplate.api.naver;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/naver")
@RequiredArgsConstructor
public class NaverRestaurantController {

    private final NaverLocalSearchService naverService;

    @GetMapping("/fetch")
    public ResponseEntity<String> fetchRestaurants(@RequestParam String location) {
        naverService.searchAndSaveRestaurants("맛집", location);
        return ResponseEntity.ok("맛집 저장 완료!");
    }
}
