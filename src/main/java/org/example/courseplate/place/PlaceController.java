package org.example.courseplate.place;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("places")
public class PlaceController {

    private final PlaceService placeService;

    @Autowired
    public PlaceController(PlaceService placeService){
        this.placeService = placeService;
    }

    @PostMapping("/add")
    public Place add(@RequestBody Place place){
        return placeService.add(place);
    }

    @GetMapping("/placename/{placeName}")
    public String getPlaceByPlaceName(@PathVariable String placeName){
        return placeService.getPlaceByPlaceName(placeName);
    }

    @GetMapping("/all")
    public List<Place> getAllPlaces() {
        return placeService.getAllPlaces();
    }

    @GetMapping("/placeid/{placeId}")
    public Place getPlaceByPlaceId(@PathVariable String placeId) {
        return placeService.getPlaceByPlaceId(placeId);
    }

    @PutMapping("/update/{id}")
    public Place updatePlace(@PathVariable String id, @RequestBody Place updatedPlace) {
        return placeService.updatePlace(id, updatedPlace);
    }

    @DeleteMapping("/delete/{id}")
    public void deletePlace(@PathVariable String id) {
        placeService.deletePlace(id);
    }
}
