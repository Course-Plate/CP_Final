package org.example.courseplate.place;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("places") // 모든 요청은 /places 경로 하위
public class PlaceController {

    private final PlaceService placeService;

    @Autowired
    public PlaceController(PlaceService placeService){
        this.placeService = placeService;
    }

    // 장소 추가
    @PostMapping("/add")
    public Place add(@RequestBody Place place){
        return placeService.add(place);
    }

    // 장소 이름으로 주소 조회
    @GetMapping("/placename/{placeName}")
    public String getPlaceByPlaceName(@PathVariable String placeName){
        return placeService.getPlaceByPlaceName(placeName);
    }

    // 모든 장소 목록 조회
    @GetMapping("/all")
    public List<Place> getAllPlaces() {
        return placeService.getAllPlaces();
    }

    // placeId로 장소 정보 조회
    @GetMapping("/placeid/{placeId}")
    public Place getPlaceByPlaceId(@PathVariable String placeId) {
        return placeService.getPlaceByPlaceId(placeId);
    }

    // 장소 정보 수정
    @PutMapping("/update/{id}")
    public Place updatePlace(@PathVariable String id, @RequestBody Place updatedPlace) {
        return placeService.updatePlace(id, updatedPlace);
    }

    // 장소 삭제
    @DeleteMapping("/delete/{id}")
    public void deletePlace(@PathVariable String id) {
        placeService.deletePlace(id);
    }
}