    package org.example.courseplate.place;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.web.bind.annotation.*;

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

        @GetMapping("/placename/{placeNmae}")
        public String getPlaceByPlaceName(@PathVariable String placeNmae){
            return placeService.getPlaceByPlaceName(placeNmae);
        }
    }
